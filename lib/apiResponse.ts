import { NextResponse } from 'next/server';

export const apiResponse = {
  success: (data: any, message = 'Success', status = 200) => {
    return NextResponse.json({ success: true, message, data }, { status });
  },

  error: (message = 'Something went wrong', status = 400) => {
    return NextResponse.json({ success: false, message }, { status });
  },

  paginate: (data: any[], total: number, page: number, limit: number) => {
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  },

  unauthorized: (message = 'Unauthorized access') => {
    return NextResponse.json({ success: false, message }, { status: 401 });
  },

  forbidden: (message = 'Access forbidden') => {
    return NextResponse.json({ success: false, message }, { status: 403 });
  }
};
