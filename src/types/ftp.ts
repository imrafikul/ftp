export interface FtpFileItem {
  id: string;
  name: string;
  path: string;
  category: 'movies' | 'tv' | 'games' | 'software' | 'anime' | 'bangla' | 'iptv';
  subCategory?: string;
  size: string;
  sizeBytes: number;
  date: string;
  type: 'file' | 'folder';
  extension?: string;
  rating?: number;
  year?: number;
  quality?: '4K UHD' | '1080p BluRay' | '1080p WEB-DL' | '720p HD' | 'HDRip' | 'Lossless';
  language?: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string; // sample video preview
  downloadCount?: number;
  codec?: string;
  audio?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export interface FtpDirectoryNode {
  name: string;
  path: string;
  type: 'folder';
  modifiedDate: string;
  permissions: string;
  itemCount: number;
  children?: (FtpDirectoryNode | FtpDirectoryFile)[];
}

export interface FtpDirectoryFile {
  name: string;
  path: string;
  type: 'file';
  size: string;
  sizeBytes: number;
  modifiedDate: string;
  permissions: string;
  downloadUrl: string;
  mimeType: string;
}

export interface IptvChannel {
  id: string;
  name: string;
  category: 'Sports' | 'Bangla News' | 'Bangla Entertainment' | 'Movies' | 'Infotainment' | 'Music';
  logo: string;
  currentShow: string;
  quality: '1080p 50fps' | '1080p' | '720p';
  isLive: boolean;
  videoUrl: string;
}

export interface DownloadTask {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  progress: number;
  speed: string; // e.g. "11.8 MB/s"
  status: 'downloading' | 'paused' | 'completed';
  path: string;
  addedAt: string;
}
