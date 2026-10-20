export const SITE_TITLE = '천천히 부자되기';
export const SITE_DESCRIPTION = '장기 투자 기록과 정보를 나누는 블로그';

export const CATEGORIES = {
  journal: { name: '내 투자 기록', description: '매수·매도 기록과 그때의 생각을 남깁니다.' },
  guide: { name: '장기 투자 정보', description: '장기 투자에 필요한 개념과 방법을 정리합니다.' },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

// 검색엔진 소유 확인 코드 (구글 서치 콘솔, 네이버 서치어드바이저에서 받은 content 값)
export const SITE_VERIFICATION = {
  google: '',
  naver: '',
};
