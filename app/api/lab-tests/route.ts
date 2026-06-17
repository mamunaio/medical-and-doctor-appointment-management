import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import LabTest from "@/models/LabTest";
import { apiResponse } from "@/lib/apiResponse";
import { requireAuth, AuthUser } from "@/lib/authMiddleware";

async function getLabTests(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    let query: any = { isActive: true };

    if (search) {
      query.$or = [
        { testName: { $regex: search, $options: "i" } },
        { testCode: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category;
    }

    const tests = await LabTest.find(query)
      .select("testName testCode category price sampleType preparation parameters")
      .sort({ testName: 1 })
      .limit(100);

    return apiResponse.success(tests);
  } catch (error: any) {
    return apiResponse.error(error.message, 500);
  }
}

async function createLabTest(req: NextRequest, user: AuthUser) {
  try {
    await dbConnect();
    const body = await req.json();

    const existingTest = await LabTest.findOne({ testCode: body.testCode });
    if (existingTest) {
      return apiResponse.error("Test with this code already exists", 400);
    }

    const test = await LabTest.create(body);
    return apiResponse.success(test, "Lab test created successfully", 201);
  } catch (error: any) {
    return apiResponse.error(error.message, 400);
  }
}

export const GET = requireAuth(getLabTests);
export const POST = requireAuth(createLabTest);
