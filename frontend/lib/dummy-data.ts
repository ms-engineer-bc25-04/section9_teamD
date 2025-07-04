export const dummyEventsData = [
  {
    id: "event1",
    title: "運動会",
    date: "2025-09-15",
    durationMinutes: 120,
    totalPoints: 50,
    timeSlots: [
      {
        slot: "午前",
        participants: [
          { id: "parent1", name: "田中太郎", email: "tanaka@example.com" },
          { id: "parent2", name: "佐藤花子", email: "sato@example.com" },
        ],
      },
      {
        slot: "午後",
        participants: [
          { id: "parent3", name: "鈴木一郎", email: "suzuki@example.com" },
        ],
      },
    ],
  },
  // 必要に応じて他のイベントも追加
];

export const dummyParentsData = [
  {
    id: "parent1",
    name: "田中太郎",
    email: "tanaka@example.com",
    currentPoints: 100,
    totalPoints: 200,
  },
  {
    id: "parent2",
    name: "佐藤花子",
    email: "sato@example.com",
    currentPoints: 80,
    totalPoints: 150,
  },
  {
    id: "parent3",
    name: "鈴木一郎",
    email: "suzuki@example.com",
    currentPoints: 60,
    totalPoints: 120,
  },
  // 必要に応じて他の保護者も追加
];