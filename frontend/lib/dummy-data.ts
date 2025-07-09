export const dummyEventsData = [
  {
    id: "event1",
    title: "読み聞かせ",
    date: "2025-07-22",
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
          { id: "parent3", name: "中村あやか", email: "ayaka@example.com" },
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
    totalPoints: 100,
  },
  {
    id: "parent2",
    name: "佐藤花子",
    email: "sato@example.com",
    currentPoints: 80,
    totalPoints: 80,
  },
  {
    id: "parent3",
    name: "中村あやか",
    email: "ayaka@example.com",
    currentPoints: 0,
    totalPoints: 0,
  },
  // 必要に応じて他の保護者も追加
];