export const SITE_TITLE = '천천히 부자되기';
export const SITE_DESCRIPTION = '장기 투자 정보와 기업·ETF 분석을 나누는 블로그';

export const CATEGORIES = {
  analysis: { name: '기업·ETF 분석', description: '기업과 ETF를 장기 투자 관점에서 살펴봅니다.' },
  guide: { name: '장기 투자 정보', description: '장기 투자에 필요한 개념과 방법을 정리합니다.' },
  news: { name: '주간 시장 정리', description: '지난 한 주의 주식 시장 소식을 장기 투자자 눈높이로 정리합니다.' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

// 검색엔진 소유 확인 코드 (구글 서치 콘솔, 네이버 서치어드바이저에서 받은 content 값)
export const SITE_VERIFICATION = {
  google: 'bckSpdEYuAZxaprblwAoISO6uDcHufSNm7dZ9t60mL8',
  naver: '',
};
