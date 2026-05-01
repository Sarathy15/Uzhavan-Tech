import React, { useMemo, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

type DayItem = {
  date: Date;
  uploads: string[]; // data URLs for preview
};

const WeekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getMonthMatrix = (year: number, month: number): (DayItem | null)[] => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const matrix: (DayItem | null)[] = [];

  // fill leading blanks
  for (let i = 0; i < first.getDay(); i++) matrix.push(null);

  for (let d = 1; d <= last.getDate(); d++) {
    matrix.push({ date: new Date(year, month, d), uploads: [] });
  }

  // fill trailing blanks to complete last week
  while (matrix.length % 7 !== 0) matrix.push(null);
  return matrix;
};

const CropUploadCalendar: React.FC = () => {
  const { t } = useTranslation();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const [days, setDays] = useState<(DayItem | null)[]>(() => getMonthMatrix(year, month));

  const monthName = useMemo(() => new Date(year, month).toLocaleString(undefined, { month: 'long' }), [year, month]);

  const handlePrev = () => {
    const next = new Date(year, month - 1, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
    setDays(getMonthMatrix(next.getFullYear(), next.getMonth()));
  };

  const handleNext = () => {
    const next = new Date(year, month + 1, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
    setDays(getMonthMatrix(next.getFullYear(), next.getMonth()));
  };

  const handleFile = async (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setDays((prev) => {
        const next = prev.slice();
        const item = next[index];
        if (item) {
          // append preview
          item.uploads = [...item.uploads, dataUrl];
          next[index] = item;
        }
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-brand-green-dark">{t('calendar.title') || `${monthName} ${year}`}</h3>
          <p className="text-sm text-gray-500">{t('calendar.subtitle') || 'Upload crop photos for specific days to track growth and issues.'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 16.293a1 1 0 010-1.414L15.586 11H5a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
          </button>
          <div className="text-sm font-medium text-gray-700 px-3">{monthName} {year}</div>
          <button onClick={handleNext} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.707 3.707a1 1 0 010 1.414L4.414 9H15a1 1 0 110 2H4.414l3.293 3.293a1 1 0 11-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm sm:text-xs">
        {WeekDays.map((d) => (
          <div key={d} className="font-medium text-gray-600 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {days.map((day, idx) => (
          <div key={idx} className={`min-h-[100px] p-2 border rounded-lg flex flex-col ${day ? 'bg-white' : 'bg-gray-50'} `}>
            {day ? (
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">{day.date.getDate()}</div>
                  <label className="text-xs inline-flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f, idx);
                      }}
                      className="hidden"
                    />
                    <span className="px-2 py-1 bg-brand-green text-white text-xs rounded-full">Upload</span>
                  </label>
                </div>

                <div className="flex-1 overflow-hidden">
                  {day.uploads.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">No uploads</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {day.uploads.map((u, i) => (
                        <img key={i} src={u} alt={`upload-${i}`} className="w-full h-20 object-cover rounded-md" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropUploadCalendar;
