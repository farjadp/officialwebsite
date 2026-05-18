import { prisma } from '../src/lib/prisma'

const startupsToSeed = [
    "Imedica", "HubWeld", "SingularMind", "DocLast", "24 Care",
    "Heal Genix", "FlyChemix", "NorthRoad", "iRIS", "Distant",
    "Fekrooneh", "ZipKip", "ArtoKids", "Ganjeh", "Alfando",
    "Mirana", "Nazh", "REJ", "Prowl", "StruSmart",
    "HoloDesign", "Smart diet", "VoiceMed", "CRM 24", "Balou"
].map((name, index) => {
    // Generate deterministic but varied placeholder data based on index
    const industries = ["HealthTech", "SaaS", "FinTech", "EdTech", "AI/ML", "E-Commerce", "Logistics", "IoT"];
    const industry = industries[index % industries.length];

    const levels = ["98%", "99%", "100%", "95%", "97%"];
    const satisfaction = levels[index % levels.length];

    // Alternating founder photos for variety
    const founderImages = [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    ];

    const companyLogos = [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=150&h=150&fit=crop",
        "https://images.unsplash.com/photo-1523730205978-59fd1b2965e3?w=150&h=150&fit=crop"
    ];

    // Status logic
    const statuses = ["Active Advisory", "Completed", "Successfully Exited"];
    const status = statuses[index % statuses.length];
    const isActive = status === "Active Advisory";

    // Date logic (Randomized placeholders)
    const startYear = 2018 + (index % 5);
    const startMonth = ["Jan", "Mar", "Jun", "Sep", "Nov"][index % 5];
    const startDate = `${startMonth} ${startYear}`;
    const endDate = isActive ? "Present" : `Dec ${startYear + 2}`;

    return {
        name,
        industry,
        satisfaction,
        status,
        isActive,
        startDate,
        endDate,
        website: `https://${name.toLowerCase().replace(/\s+/g, '')}.example.com`,
        linkedin: `https://linkedin.com/company/${name.toLowerCase().replace(/\s+/g, '')}`,
        logo: companyLogos[index % companyLogos.length],
        description: `A disruptive ${industry} startup focused on scalable solutions and rapid market entry. Guided from initial seed to strong product-market fit.`,
        founderName: `Founder of ${name}`,
        founderPhoto: founderImages[index % founderImages.length],
        order: index
    }
});

async function main() {
  console.log('Seeding MentoredStartups...')
  for (const startup of startupsToSeed) {
    await prisma.mentoredStartup.create({
      data: startup
    })
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
