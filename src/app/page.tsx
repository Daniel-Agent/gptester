'use client';

import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

type RelationshipType = '헤어졌어요' | '연락은 하지만 무슨 사이인지 모르겠어요' | '연애중이지만 불안해요' | '짝사랑이예요';
type Gender = 'female' | 'male';

interface CounselingForm {
  readingTitle: string;
  myGender: Gender;
  myBirthDate: string;
  myBirthPlace: string;
  partnerGender: Gender;
  partnerBirthDate: string;
  partnerBirthPlace: string;
  relationshipType: RelationshipType;
  situation: string;
  systemPrompt: string;
}

export default function Home() {
  const [form, setForm] = useState<CounselingForm>({
    readingTitle: '',
    myGender: 'female',
    myBirthDate: '',
    myBirthPlace: '대한민국 서울',
    partnerGender: 'male',
    partnerBirthDate: '',
    partnerBirthPlace: '대한민국 서울',
    relationshipType: '연애중이지만 불안해요',
    situation: '',
    systemPrompt: '',
  });
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.situation.trim() || !form.systemPrompt.trim()) return;

    setIsLoading(true);
    try {
      const genAI = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      });

      const userPrompt = `[리딩 주제]
${form.readingTitle}

[내 정보]
- 성별: ${form.myGender}
- 생년월일: ${form.myBirthDate}
- 출생지: ${form.myBirthPlace}

[상대방 정보]
- 성별: ${form.partnerGender}
- 생년월일: ${form.partnerBirthDate}
- 출생지: ${form.partnerBirthPlace}

[관계의 유형]
${form.relationshipType}

[상황 설명]
${form.situation}`;

      const prompt = `${form.systemPrompt}\n${userPrompt}`;
      const model = 'gemini-2.5-flash';
      const result = await genAI.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.85,
        },
      });
      setResponse(result.text || '');
    } catch (error) {
      console.error('Error:', error);
      setResponse('죄송합니다. 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          상담 채팅
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시스템 프롬프트
                </label>
                <textarea
                  name="systemPrompt"
                  value={form.systemPrompt}
                  onChange={handleInputChange}
                  placeholder="시스템 프롬프트를 입력하세요..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  리딩 제목
                </label>
                <input
                  type="text"
                  name="readingTitle"
                  value={form.readingTitle}
                  onChange={handleInputChange}
                  placeholder="리딩 제목을 입력하세요"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">내 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      성별
                    </label>
                    <select
                      name="myGender"
                      value={form.myGender}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="female">여성</option>
                      <option value="male">남성</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      생년월일
                    </label>
                    <input
                      type="datetime-local"
                      name="myBirthDate"
                      value={form.myBirthDate}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      출생지
                    </label>
                    <input
                      type="text"
                      name="myBirthPlace"
                      value={form.myBirthPlace}
                      onChange={handleInputChange}
                      placeholder="예: 대한민국 서울"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">상대방 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      성별
                    </label>
                    <select
                      name="partnerGender"
                      value={form.partnerGender}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="female">여성</option>
                      <option value="male">남성</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      생년월일
                    </label>
                    <input
                      type="datetime-local"
                      name="partnerBirthDate"
                      value={form.partnerBirthDate}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      출생지
                    </label>
                    <input
                      type="text"
                      name="partnerBirthPlace"
                      value={form.partnerBirthPlace}
                      onChange={handleInputChange}
                      placeholder="예: 대한민국 서울"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  관계 유형
                </label>
                <select
                  name="relationshipType"
                  value={form.relationshipType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="헤어졌어요">헤어졌어요</option>
                  <option value="연락은 하지만 무슨 사이인지 모르겠어요">연락은 하지만 무슨 사이인지 모르겠어요</option>
                  <option value="연애중이지만 불안해요">연애중이지만 불안해요</option>
                  <option value="짝사랑이예요">짝사랑이예요</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상황 설명
                </label>
                <textarea
                  name="situation"
                  value={form.situation}
                  onChange={handleInputChange}
                  placeholder="상황을 자세히 설명해주세요..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              상담 시작하기
            </button>
          </form>

          {isLoading && (
            <div className="mt-4 text-center text-gray-600">
              응답을 생성하는 중...
            </div>
          )}

          {response && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">상담 결과:</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
