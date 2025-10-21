import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    { title: "Buyer Dashboard", path: "/buyer/login", gradient: "from-blue-400 to-purple-500" },
    { title: "Approver Dashboard", path: "/approver/login", gradient: "from-green-400 to-teal-500" },
    { title: "Admin Dashboard", path: "/admin/login", gradient: "from-orange-400 to-red-500" },
    { title: "Vendor Dashboard", path: "/vendor/login", gradient: "from-pink-400 to-yellow-400" },
  ];

  return (
    <div className="h-screen flex justify-center items-center ">
      <div className="flex flex-col gap-12 p-6 w-full max-w-7xl">
        <h2 className="text-4xl font-bold text-center text-gray-800">NFA Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => navigate(card.path, { state: { gradient: card.gradient, role: card.title.split(' ')[0].toLowerCase() } })}
              className={`cursor-pointer flex flex-col items-center justify-center text-center rounded-2xl p-16 min-h-[220px] text-white font-bold shadow-2xl transform transition-transform duration-300 hover:scale-105 bg-gradient-to-r ${card.gradient}`}
            >
              <h3 className="text-2xl mb-3">{card.title}</h3>
              <p className="text-lg opacity-90">Click to open</p>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
}
