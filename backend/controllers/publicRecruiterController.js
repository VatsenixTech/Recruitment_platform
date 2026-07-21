import Application from "../models/Application.js";
import Candidate from "../models/Candidate.js";
import DemoRequest from "../models/DemoRequest.js";
import Interview from "../models/Interview.js";
import Job from "../models/Job.js";
import Offer from "../models/Offer.js";
import TrialSignup from "../models/TrialSignup.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function formatDay(date) {
  return date.toISOString().slice(0, 10);
}

function buildLastThirtyDays() {
  const result = [];

  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - index);

    result.push({
      date: formatDay(date),
      applications: 0,
    });
  }

  return result;
}

export async function getRecruiterLandingMetrics(req, res, next) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalCandidates,
      activeJobs,
      hires,
      totalApplications,
      applicationStages,
      applicationTimeline,
      topJobs,
      scheduledInterviews,
      offersSent,
    ] = await Promise.all([
      Candidate.countDocuments(),

      Job.countDocuments({
        status: "active",
      }),

      Application.countDocuments({
        stage: "hired",
      }),

      Application.countDocuments(),

      Application.aggregate([
        {
          $group: {
            _id: "$stage",
            count: { $sum: 1 },
          },
        },
      ]),

      Application.aggregate([
        {
          $match: {
            appliedAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$appliedAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),

      Application.aggregate([
        {
          $group: {
            _id: "$jobId",
            applicationCount: { $sum: 1 },
          },
        },
        {
          $sort: {
            applicationCount: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "jobs",
            localField: "_id",
            foreignField: "_id",
            as: "job",
          },
        },
        {
          $unwind: "$job",
        },
        {
          $project: {
            _id: 0,
            jobId: "$job._id",
            title: "$job.title",
            location: "$job.location",
            applications: "$applicationCount",
          },
        },
      ]),

      Interview.find({
        status: "scheduled",
        scheduledAt: { $gte: new Date() },
      })
        .sort({ scheduledAt: 1 })
        .limit(4)
        .populate({
          path: "applicationId",
          populate: [
            {
              path: "candidateId",
              select: "fullName headline",
            },
            {
              path: "jobId",
              select: "title",
            },
          ],
        })
        .lean(),

      Offer.countDocuments({
        status: {
          $in: ["sent", "accepted"],
        },
      }),
    ]);

    const stageMap = {
      applied: 0,
      screening: 0,
      shortlisted: 0,
      interview: 0,
      offered: 0,
      hired: 0,
    };

    for (const stage of applicationStages) {
      if (Object.hasOwn(stageMap, stage._id)) {
        stageMap[stage._id] = stage.count;
      }
    }

    const timeline = buildLastThirtyDays();
    const timelineIndex = new Map(
      timeline.map((item, index) => [item.date, index])
    );

    for (const point of applicationTimeline) {
      const index = timelineIndex.get(point._id);

      if (index !== undefined) {
        timeline[index].applications = point.count;
      }
    }

    const normalizedInterviews = scheduledInterviews.map((interview) => {
      const application = interview.applicationId;
      const candidate = application?.candidateId;
      const job = application?.jobId;

      return {
        id: interview._id,
        candidateName: candidate?.fullName || "Candidate",
        candidateRole: candidate?.headline || job?.title || "Applicant",
        jobTitle: job?.title || "",
        round: interview.round,
        scheduledAt: interview.scheduledAt,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totals: {
          candidates: totalCandidates,
          activeJobs,
          applications: totalApplications,
          hires,
          scheduledInterviews: normalizedInterviews.length,
          offersSent,
        },
        stages: stageMap,
        timeline,
        topJobs,
        upcomingInterviews: normalizedInterviews,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createDemoRequest(req, res, next) {
  try {
    const fullName = cleanText(req.body.fullName);
    const workEmail = cleanText(req.body.workEmail).toLowerCase();
    const companyName = cleanText(req.body.companyName);
    const phoneNumber = cleanText(req.body.phoneNumber);
    const companySize = cleanText(req.body.companySize);

    if (fullName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Enter your full name.",
      });
    }

    if (!EMAIL_PATTERN.test(workEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid work email.",
      });
    }

    if (companyName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Enter your company name.",
      });
    }

    const allowedSizes = [
      "1-10",
      "11-50",
      "51-200",
      "201-500",
      "501-1000",
      "1000+",
    ];

    if (!allowedSizes.includes(companySize)) {
      return res.status(400).json({
        success: false,
        message: "Select a valid company size.",
      });
    }

    const existingRequest = await DemoRequest.findOne({
      workEmail,
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    }).lean();

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message:
          "A request was already submitted for this email. Our team will contact you.",
      });
    }

    const request = await DemoRequest.create({
      fullName,
      workEmail,
      companyName,
      phoneNumber,
      companySize,
    });

    return res.status(201).json({
      success: true,
      message: "Your demo request was submitted successfully.",
      data: {
        requestId: request._id,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createTrialSignup(req, res, next) {
  try {
    const fullName = cleanText(req.body.fullName);
    const workEmail = cleanText(req.body.workEmail).toLowerCase();
    const companyName = cleanText(req.body.companyName);

    if (fullName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Enter your full name.",
      });
    }

    if (!EMAIL_PATTERN.test(workEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid work email.",
      });
    }

    if (companyName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Enter your company name.",
      });
    }

    const existingSignup = await TrialSignup.findOne({ workEmail }).lean();

    if (existingSignup) {
      return res.status(409).json({
        success: false,
        message:
          "A trial registration already exists for this email. Please continue to recruiter registration.",
      });
    }

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    const signup = await TrialSignup.create({
      fullName,
      workEmail,
      companyName,
      trialEndsAt,
    });

    return res.status(201).json({
      success: true,
      message: "Trial started successfully.",
      data: {
        signupId: signup._id,
        workEmail: signup.workEmail,
        trialEndsAt: signup.trialEndsAt,
        registrationPath: "/recruiter/register",
      },
    });
  } catch (error) {
    next(error);
  }
}