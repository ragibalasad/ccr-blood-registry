"use server";
import { prisma } from "@/lib/prisma";

/**
 * Public stats for the home page – no auth required.
 * Only aggregate counts are exposed; no PII is leaked.
 */
export async function getPublicStats() {
  const [totalDonors, withBloodGroup, eligibleCount, bloodDist] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { bloodGroup: { not: null } } }),
      (() => {
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        return prisma.user.count({
          where: {
            bloodGroup: { not: null },
            OR: [
              { lastDonatedAt: { lte: ninetyDaysAgo } },
              { lastDonatedAt: null },
            ],
          },
        });
      })(),
      prisma.user.groupBy({
        by: ["bloodGroup"],
        _count: { bloodGroup: true },
        where: { bloodGroup: { not: null } },
        orderBy: { _count: { bloodGroup: "desc" } },
      }),
    ]);

  return {
    totalDonors,
    withBloodGroup,
    eligibleCount,
    bloodDist: bloodDist.map((d) => ({
      group: d.bloodGroup!,
      count: d._count.bloodGroup,
    })),
  };
}
