import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SharedResumeClient from "./page-client";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const resume = await db.resume.findUnique({ where: { shareToken: token } });
  if (!resume || !resume.isShared) return { title: "Resume not found" };
  let name = resume.title;
  try {
    const data = JSON.parse(resume.content);
    if (data?.personalInfo?.fullName) name = data.personalInfo.fullName;
  } catch {}
  return {
    title: `${name} — Resume`,
    description: `View ${name}'s resume, created with Jinzai.`,
    openGraph: { title: `${name} — Resume`, type: "profile" },
  };
}

export default async function SharedResumePage({ params }: Props) {
  const { token } = await params;
  const resume = await db.resume.findUnique({ where: { shareToken: token } });
  if (!resume || !resume.isShared) notFound();

  const data = JSON.parse(resume.content);
  return (
    <SharedResumeClient
      data={data}
      template={resume.template as never}
      accent={resume.accentColor}
      font={resume.fontFamily}
      title={resume.title}
    />
  );
}
