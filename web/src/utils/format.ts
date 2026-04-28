export function formatDuration(startTime: Date, endTime: Date | null): string {
  if (!endTime) {
    return '时间待定';
  }

  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();

  if (diffMs <= 0) {
    return '未知时长';
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    if (hours > 0) {
      return `${days}天${hours}小时`;
    }
    return `${days}天`;
  }

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    return `${hours}小时`;
  }

  return `${minutes}分钟`;
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
    return '免费';
  }

  if (numPrice <= 0) {
    return '免费';
  }

  if (numPrice === Math.floor(numPrice)) {
    return `¥${Math.floor(numPrice)}`;
  }

  return `${numPrice.toFixed(2)}元`;
}

export function formatDate(date: Date): string {
  const now = new Date();
  const target = new Date(date);

  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const hours = target.getHours();
  const minutes = target.getMinutes();
  const period = hours < 12 ? '上午' : '下午';
  const displayHours = hours <= 12 ? hours : hours - 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  const timeStr = `${period}${displayHours}点${displayMinutes}分`;

  const currentYear = now.getFullYear();
  const targetYear = target.getFullYear();
  const month = (target.getMonth() + 1).toString().padStart(2, '0');
  const day = target.getDate().toString().padStart(2, '0');

  if (diffDays < 0) {
    const pastDays = Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    if (pastDays === 0) {
      return `今天 ${timeStr}`;
    } else if (pastDays === 1) {
      return `昨天 ${timeStr}`;
    } else if (pastDays === 2) {
      return `前天 ${timeStr}`;
    } else if (pastDays < 7 && targetYear === currentYear) {
      return `${month}-${day} ${timeStr}`;
    } else if (targetYear === currentYear) {
      return `${month}-${day}`;
    } else {
      return `${targetYear}-${month}-${day}`;
    }
  }

  if (diffDays === 0) {
    return `今天 ${timeStr}`;
  } else if (diffDays === 1) {
    return `明天 ${timeStr}`;
  } else if (diffDays === 2) {
    return `后天 ${timeStr}`;
  } else if (diffDays < 30) {
    return `${diffDays}天后 ${timeStr}`;
  } else if (targetYear === currentYear) {
    return `${month}-${day} ${timeStr}`;
  } else {
    return `${targetYear}-${month}-${day} ${timeStr}`;
  }
}
