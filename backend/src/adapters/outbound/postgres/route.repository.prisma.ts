import { RouteRepositoryPort } from '../../../core/ports/repositories';
import { Route } from '../../../core/domain/models';
import { prisma } from '../../../infrastructure/db/prisma';

export class RouteRepositoryPrisma implements RouteRepositoryPort {
  async findById(routeId: string): Promise<Route | null> {
    const row = await prisma.route.findUnique({
      where: { routeId },
    });

    if (!row) return null;

    return {
      routeId: row.routeId,
      vesselType: row.vesselType,
      fuelType: row.fuelType,
      year: row.year,
      ghgIntensity: row.ghgIntensity,
      fuelConsumption: row.fuelConsumption,
      distance: row.distance,
      totalEmissions: row.totalEmissions,
      isBaseline: row.isBaseline,
    };
  }

  async findAll(): Promise<Route[]> {
    const rows = await prisma.route.findMany({
      orderBy: [{ year: 'asc' }, { routeId: 'asc' }],
    });

    return rows.map((row: (typeof rows)[number]) => ({
      routeId: row.routeId,
      vesselType: row.vesselType,
      fuelType: row.fuelType,
      year: row.year,
      ghgIntensity: row.ghgIntensity,
      fuelConsumption: row.fuelConsumption,
      distance: row.distance,
      totalEmissions: row.totalEmissions,
      isBaseline: row.isBaseline,
    }));
  }

  async findBaseline(): Promise<Route | null> {
    const row = await prisma.route.findFirst({
      where: { isBaseline: true },
      orderBy: [{ year: 'desc' }, { routeId: 'asc' }],
    });

    if (!row) return null;

    return {
      routeId: row.routeId,
      vesselType: row.vesselType,
      fuelType: row.fuelType,
      year: row.year,
      ghgIntensity: row.ghgIntensity,
      fuelConsumption: row.fuelConsumption,
      distance: row.distance,
      totalEmissions: row.totalEmissions,
      isBaseline: row.isBaseline,
    };
  }

  async setBaseline(routeId: string): Promise<void> {
    await prisma.$transaction([
      prisma.route.updateMany({
        where: { isBaseline: true },
        data: { isBaseline: false },
      }),
      prisma.route.update({
        where: { routeId },
        data: { isBaseline: true },
      }),
    ]);
  }

  async save(route: Route): Promise<void> {
    await prisma.route.upsert({
      where: { routeId: route.routeId },
      create: {
        routeId: route.routeId,
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        fuelConsumption: route.fuelConsumption,
        distance: route.distance,
        totalEmissions: route.totalEmissions,
        isBaseline: route.isBaseline,
      },
      update: {
        vesselType: route.vesselType,
        fuelType: route.fuelType,
        year: route.year,
        ghgIntensity: route.ghgIntensity,
        fuelConsumption: route.fuelConsumption,
        distance: route.distance,
        totalEmissions: route.totalEmissions,
        isBaseline: route.isBaseline,
      },
    });
  }
}

