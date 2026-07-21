import DemoRequest from "../models/DemoRequest.js";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateDemoRequest(body) {
  const errors = [];
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const allowedCompanySizes = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1000+",
  ];

  const fullName = normalizeText(body.fullName);
  const workEmail = normalizeText(body.workEmail).toLowerCase();
  const phoneNumber = normalizeText(body.phoneNumber);
  const companyName = normalizeText(body.companyName);
  const companySize = normalizeText(body.companySize);
  const source = normalizeText(body.source) || "recruiter-landing-page";

  if (fullName.length < 2) {
    errors.push({
      field: "fullName",
      message: "Full name must contain at least 2 characters.",
    });
  }

  if (!emailPattern.test(workEmail)) {
    errors.push({
      field: "workEmail",
      message: "Enter a valid work email.",
    });
  }

  if (companyName.length < 2) {
    errors.push({
      field: "companyName",
      message: "Company name must contain at least 2 characters.",
    });
  }

  if (!allowedCompanySizes.includes(companySize)) {
    errors.push({
      field: "companySize",
      message: "Select a valid company size.",
    });
  }

  if (phoneNumber && phoneNumber.replace(/\D/g, "").length < 10) {
    errors.push({
      field: "phoneNumber",
      message: "Enter a valid phone number.",
    });
  }

  return {
    errors,
    sanitizedData: {
      fullName,
      workEmail,
      phoneNumber,
      companyName,
      companySize,
      source,
    },
  };
}

export async function createDemoRequest(req, res, next) {
  try {
    const { errors, sanitizedData } = validateDemoRequest(req.body);

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please correct the highlighted information.",
        errors,
      });
    }

    const recentRequest = await DemoRequest.findOne({
      workEmail: sanitizedData.workEmail,
      createdAt: {
        $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    }).lean();

    if (recentRequest) {
      return res.status(409).json({
        success: false,
        message:
          "A demo request for this email was already submitted recently. Our team will contact you shortly.",
      });
    }

    const demoRequest = await DemoRequest.create({
      ...sanitizedData,
      ipAddress:
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "",
      userAgent: req.headers["user-agent"] || "",
    });

    return res.status(201).json({
      success: true,
      message: "Demo request submitted successfully.",
      data: {
        requestId: demoRequest._id,
        status: demoRequest.status,
        createdAt: demoRequest.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDemoRequests(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
      100
    );

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      DemoRequest.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      DemoRequest.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(error);
  }
}