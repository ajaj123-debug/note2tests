import React from "react";

const testimonials = [
  {
    img: "https://i.pravatar.cc/150?img=1",
    name: "Sarah Johnson",
    title: "Medical Student",
    quote:
      "Note2Test transformed my study routine. It helped me convert my anatomy notes into practice questions, making revision so much more effective!",
  },
  {
    img: "https://i.pravatar.cc/150?img=2",
    name: "David Chen",
    title: "CS Graduate",
    quote:
      "The AI-generated questions are incredibly relevant. It's like having a personal tutor who knows exactly what I need to review.",
  },
  {
    img: "https://i.pravatar.cc/150?img=3",
    name: "Emily Martinez",
    title: "Law Student",
    quote:
      "Being able to turn my case study notes into practice questions has been game-changing for my exam preparation.",
  },
  {
    img: "https://i.pravatar.cc/150?img=4",
    name: "Michael Park",
    title: "High School Teacher",
    quote:
      "I use Note2Test to create practice quizzes for my students. It saves me hours of work and the students love the interactive format!",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-4xl mx-auto px-4">
      {/* Outer floating card */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 transform transition duration-300 hover:-translate-y-1 hover:shadow-3xl">
        {/* 2x2 grid inside */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(({ img, name, title, quote }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-4 flex space-x-4"
            >
              {/* Avatar */}
              <img
                src={img}
                alt={name}
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Text */}
              <div>
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="mt-1 text-gray-700 text-sm leading-relaxed">
                  "{quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
