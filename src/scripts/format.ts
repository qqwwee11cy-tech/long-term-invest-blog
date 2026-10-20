// 원 단위 금액을 "1억 2,345만 원"처럼 읽기 쉽게 바꿉니다.
export function won(value: number): string {
  if (!Number.isFinite(value)) return '-';
  const sign = value < 0 ? '-' : '';
  const v = Math.round(Math.abs(value));
  const eok = Math.floor(v / 1e8);
  const man = Math.floor((v % 1e8) / 1e4);
  if (eok === 0 && man === 0) return `${sign}${v.toLocaleString('ko-KR')}원`;
  const parts = [];
  if (eok) parts.push(`${eok.toLocaleString('ko-KR')}억`);
  if (man) parts.push(`${man.toLocaleString('ko-KR')}만`);
  return `${sign}${parts.join(' ')} 원`;
}

export function num(input: HTMLInputElement | null, fallback = 0): number {
  const v = parseFloat((input?.value ?? '').replace(/,/g, ''));
  return Number.isFinite(v) ? v : fallback;
}
