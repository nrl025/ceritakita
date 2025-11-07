import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import argon2 from 'argon2';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role, teacherCode } = await req.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    if (!['SISWA', 'GURU'].includes(role)) {
      return NextResponse.json(
        { error: 'Role harus SISWA atau GURU' },
        { status: 400 }
      );
    }

    if (role === 'GURU') {
      const validTeacherCode = process.env.TEACHER_CODE;
      if (!teacherCode || teacherCode !== validTeacherCode) {
        return NextResponse.json(
          { error: 'Kode guru tidak valid' },
          { status: 400 }
        );
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json(
      { user, message: 'Registrasi berhasil' },
      { status: 201 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
