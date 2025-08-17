import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'María González',
    text: 'Excelente profesional, me ayudó con mi caso de despido injustificado. Muy recomendada.',
    rating: 5
  },
  {
    name: 'Carlos Rodríguez',
    text: 'Su asesoría fue fundamental para resolver mi problema de pensión. Gran conocimiento.',
    rating: 5
  },
  {
    name: 'Ana Martínez',
    text: 'Profesional, seria y comprometida. Me representó en un caso complejo con éxito.',
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-slate-900 mb-4">Testimonios</h2>
          <p className="text-xl text-slate-600">Lo que dicen mis clientes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-slate-900">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
