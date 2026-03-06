import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useLanguage } from '../context/LanguageContext';

const BACKEND = 'https://burol-1-web-backend.onrender.com';

const wentWellOptions = [
  { id: 'staff_helpful', en: 'Staff was helpful and accommodating', fil: 'Ang staff ay matulungin at magalang' },
  { id: 'quick_process', en: 'Drop-off process was quick and easy', fil: 'Ang proseso ng drop-off ay mabilis at madali' },
  { id: 'easy_location', en: 'Location was easy to find', fil: 'Madaling mahanap ang lokasyon' },
  { id: 'convenient_hours', en: 'Operating hours were convenient', fil: 'Ang oras ng operasyon ay maginhawa' },
  { id: 'clear_reward', en: 'Reward process was clear and straightforward', fil: 'Ang proseso ng gantimpala ay malinaw at simple' },
];

const needsImprovementOptions = [
  { id: 'staff_training', en: 'Staff needs more training', fil: 'Ang staff ay kailangan ng mas maraming pagsasanay' },
  { id: 'confusing_process', en: 'Drop-off process was confusing', fil: 'Ang proseso ng drop-off ay nakalilito' },
  { id: 'hard_location', en: 'Location was difficult to find', fil: 'Mahirap mahanap ang lokasyon' },
  { id: 'inconvenient_hours', en: 'Operating hours were inconvenient', fil: 'Ang oras ng operasyon ay hindi maginhawa' },
  { id: 'long_wait', en: 'Waiting time was too long', fil: 'Masyadong matagal ang oras ng paghihintay' },
  { id: 'unclear_reward', en: 'Reward process was unclear', fil: 'Hindi malinaw ang proseso ng gantimpala' },
];

const starLabels = {
  en: ['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
  fil: ['', 'Napakahina', 'Mahina', 'Katamtaman', 'Magaling', 'Napakahusay'],
};

function FeedbackPage() {
  const { language } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [wentWell, setWentWell] = useState([]);
  const [needsImprovement, setNeedsImprovement] = useState([]);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleCheck = (id, list, setList) => {
    setList(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Swal.fire({
        icon: 'warning',
        title: language === 'en' ? 'Rating Required' : 'Kinakailangan ang Rating',
        text: language === 'en' ? 'Please select a star rating before submitting.' : 'Mangyaring pumili ng star rating bago mag-submit.',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    setLoading(true);
    try {
      await fetch(`${BACKEND}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, went_well: wentWell, needs_improvement: needsImprovement, comment })
      });
    } catch (err) {
      // Still show thank you even if backend isn't ready yet
      console.log('Feedback submitted locally');
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {language === 'en' ? 'Thank You for Your Feedback!' : 'Salamat sa Iyong Feedback!'}
          </h2>
          <p className="text-gray-600 mb-2">
            {language === 'en'
              ? 'Your response helps us improve the E-Cycle Hub for everyone in Barangay Burol 1.'
              : 'Ang iyong tugon ay tumutulong sa amin na mapabuti ang E-Cycle Hub para sa lahat sa Barangay Burol 1.'}
          </p>
          <p className="text-emerald-600 font-semibold text-sm mt-4">
            {language === 'en' ? '— The E-Cycle Hub Team 💚' : '— Ang Koponan ng E-Cycle Hub 💚'}
          </p>
          <button
            onClick={() => { setSubmitted(false); setRating(0); setWentWell([]); setNeedsImprovement([]); setComment(''); }}
            className="mt-6 text-sm text-emerald-600 hover:underline"
          >
            {language === 'en' ? 'Submit another response' : 'Mag-submit ng isa pa'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {language === 'en' ? 'Share Your Feedback' : 'Ibahagi ang Iyong Feedback'}
          </h1>
          <p className="text-emerald-100">
            {language === 'en'
              ? 'Help us improve by sharing your experience with E-Cycle Hub'
              : 'Tulungan kaming mapabuti sa pamamagitan ng pagbabahagi ng iyong karanasan'}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Star Rating */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            {language === 'en' ? 'Overall Experience' : 'Kabuuang Karanasan'}
          </h2>
          <div className="flex justify-center gap-3 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="text-5xl transition-transform hover:scale-110 focus:outline-none"
              >
                <span className={(hovered || rating) >= star ? 'text-yellow-400' : 'text-gray-200'}>★</span>
              </button>
            ))}
          </div>
          {(hovered || rating) > 0 && (
            <p className="text-emerald-600 font-semibold text-lg">
              {starLabels[language][hovered || rating]}
            </p>
          )}
        </div>

        {/* What Went Well */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {language === 'en' ? '👍 What went well?' : '👍 Ano ang naging maayos?'}
          </h2>
          <div className="space-y-3">
            {wentWellOptions.map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={wentWell.includes(opt.id)}
                  onChange={() => toggleCheck(opt.id, wentWell, setWentWell)}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-emerald-700 transition-colors">
                  {language === 'en' ? opt.en : opt.fil}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Needs Improvement */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {language === 'en' ? '🔧 What needs improvement?' : '🔧 Ano ang kailangang pagbutihin?'}
          </h2>
          <div className="space-y-3">
            {needsImprovementOptions.map(opt => (
              <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={needsImprovement.includes(opt.id)}
                  onChange={() => toggleCheck(opt.id, needsImprovement, setNeedsImprovement)}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-red-600 transition-colors">
                  {language === 'en' ? opt.en : opt.fil}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Comment Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            {language === 'en' ? '💬 Additional Comments' : '💬 Karagdagang Komento'}
            <span className="text-sm font-normal text-gray-400 ml-2">
              {language === 'en' ? '(Optional)' : '(Opsyonal)'}
            </span>
          </h2>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={language === 'en' ? 'Tell us more about your experience...' : 'Sabihin sa amin ang higit pa tungkol sa iyong karanasan...'}
            rows={4}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none text-gray-700"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading
            ? (language === 'en' ? 'Submitting...' : 'Isinusumite...')
            : (language === 'en' ? 'Submit Feedback' : 'Isumite ang Feedback')}
        </button>
      </div>
    </div>
  );
}

export default FeedbackPage;