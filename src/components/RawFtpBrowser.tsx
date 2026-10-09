import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileVideo, 
  FileArchive, 
  FileCode, 
  FileText, 
  File, 
  ArrowLeft, 
  Download, 
  Play, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  HardDrive,
  CornerDownRight
} from 'lucide-react';
import { FtpDirectoryNode, FtpDirectoryFile, FtpFileItem } from '../types/ftp';
import { RAW_FTP_TREE, MEDIA_ITEMS } from '../data/ftpData';

interface RawFtpBrowserProps {
  onPlayMedia: (item: FtpFileItem) => void;
  onDownloadFile: (file: { name: string; size: string; sizeBytes: number; path: string }) => void;
}

export const RawFtpBrowser: React.FC<RawFtpBrowserProps> = ({
  onPlayMedia,
  onDownloadFile,
}) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Helper to find node by path
  const findNodeByPath = (path: string, node: FtpDirectoryNode): FtpDirectoryNode | null => {
    if (path === '/' || path === '') return node;
    const parts = path.split('/').filter(Boolean);
    let current: FtpDirectoryNode = node;

    for (const part of parts) {
      const found = current.children?.find(
        (child) => child.type === 'folder' && child.name.toLowerCase() === part.toLowerCase()
      ) as FtpDirectoryNode | undefined;

      if (!found) return null;
      current = found;
    }
    return current;
  };

  const currentNode = findNodeByPath(currentPath, RAW_FTP_TREE) || RAW_FTP_TREE;

  // Handle navigate up
  const handleNavigateUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const newPath = parts.length === 0 ? '/' : '/' + parts.join('/');
    setCurrentPath(newPath);
  };

  // Handle navigate into folder
  const handleNavigateInto = (folderName: string) => {
    const newPath = currentPath === '/' ? `/${folderName}` : `${currentPath}/${folderName}`;
    setCurrentPath(newPath);
  };

  const handleCopyFtpUrl = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = `ftp://ftp.neonbadda.bd${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  // Helper to get matching media item for streaming
  const getMediaItemForFile = (filePath: string): FtpFileItem | undefined => {
    return MEDIA_ITEMS.find((m) => m.path === filePath || filePath.includes(m.name));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['mkv', 'mp4', 'avi', 'mov', 'ts'].includes(ext || '')) {
      return <FileVideo className="w-4 h-4 text-sky-400" />;
    }
    if (['zip', 'rar', 'iso', '7z', 'tar', 'gz'].includes(ext || '')) {
      return <FileArchive className="w-4 h-4 text-amber-400" />;
    }
    if (['m3u', 'm3u8'].includes(ext || '')) {
      return <FileCode className="w-4 h-4 text-emerald-400" />;
    }
    if (['txt', 'nfo', 'log'].includes(ext || '')) {
      return <FileText className="w-4 h-4 text-slate-400" />;
    }
    return <File className="w-4 h-4 text-cyan-300" />;
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Browser address bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-cyan-400 font-bold">ftp://</span>
          <span className="text-slate-100">ftp.neonbadda.bd</span>
          <button 
            onClick={() => setCurrentPath('/')}
            className={`hover:text-cyan-400 transition-colors ${currentPath === '/' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
          >
            /
          </button>
          {breadcrumbs.map((crumb, idx) => {
            const subPath = '/' + breadcrumbs.slice(0, idx + 1).join('/');
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={subPath}>
                <button
                  onClick={() => setCurrentPath(subPath)}
                  className={`hover:text-cyan-400 transition-colors ${
                    isLast ? 'text-cyan-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {crumb}
                </button>
                {!isLast && <span className="text-slate-600">/</span>}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[11px]">Server: vsftpd 3.0.5 BDIX-Patch</span>
          <button
            onClick={(e) => handleCopyFtpUrl(currentPath, e)}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700/60 transition-colors flex items-center gap-1"
            title="Copy current FTP directory URL"
          >
            {copiedPath === currentPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>Copy Dir URL</span>
          </button>
        </div>
      </div>

      {/* Directory Title Bar */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-cyan-400" />
            Index of {currentPath}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Neon Broadband Gigabit BDIX Storage Cluster • Middle Badda Node
          </p>
        </div>

        {currentPath !== '/' && (
          <button
            onClick={handleNavigateUp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>[Parent Directory]</span>
          </button>
        )}
      </div>

      {/* Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Name</th>
              <th className="py-2.5 px-4 font-semibold">Last Modified</th>
              <th className="py-2.5 px-4 font-semibold">Size</th>
              <th className="py-2.5 px-4 font-semibold hidden md:table-cell">Perms</th>
              <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {/* Parent folder entry */}
            {currentPath !== '/' && (
              <tr 
                onClick={handleNavigateUp}
                className="hover:bg-slate-800/50 cursor-pointer text-slate-400"
              >
                <td className="py-2.5 px-4 flex items-center gap-2 font-semibold text-cyan-300">
                  <CornerDownRight className="w-4 h-4" />
                  <span>.. [Parent Directory]</span>
                </td>
                <td className="py-2.5 px-4 text-slate-500">-</td>
                <td className="py-2.5 px-4 text-slate-500">-</td>
                <td className="py-2.5 px-4 text-slate-500 hidden md:table-cell">drwxr-xr-x</td>
                <td className="py-2.5 px-4 text-right text-slate-500">-</td>
              </tr>
            )}

            {/* Subfolders */}
            {currentNode.children
              ?.filter((item): item is FtpDirectoryNode => item.type === 'folder')
              .map((folder) => (
                <tr
                  key={folder.path}
                  onClick={() => handleNavigateInto(folder.name)}
                  className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 flex items-center gap-2.5 font-bold text-slate-100 group-hover:text-cyan-300">
                    <Folder className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                    <span>{folder.name}/</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{folder.modifiedDate}</td>
                  <td className="py-3 px-4 text-slate-500">[{folder.itemCount || folder.children?.length || 0} items]</td>
                  <td className="py-3 px-4 text-slate-400 hidden md:table-cell">{folder.permissions}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => handleCopyFtpUrl(folder.path, e)}
                      className="p-1 hover:text-white text-slate-400 transition-colors"
                      title="Copy folder FTP link"
                    >
                      {copiedPath === folder.path ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 inline" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 inline" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}

            {/* Files */}
            {currentNode.children
              ?.filter((item): item is FtpDirectoryFile => item.type === 'file')
              .map((file) => {
                const mediaItem = getMediaItemForFile(file.path);
                const isVideo = file.name.match(/\.(mkv|mp4|avi|mov)$/i);

                return (
                  <tr
                    key={file.path}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 flex items-center gap-2.5 text-slate-200">
                      {getFileIcon(file.name)}
                      <span className="font-medium text-slate-200 truncate max-w-xs sm:max-w-md lg:max-w-lg" title={file.name}>
                        {file.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{file.modifiedDate}</td>
                    <td className="py-3 px-4 font-bold text-cyan-300">{file.size}</td>
                    <td className="py-3 px-4 text-slate-400 hidden md:table-cell">{file.permissions}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isVideo && (
                          <button
                            onClick={() => {
                              if (mediaItem) {
                                onPlayMedia(mediaItem);
                              } else {
                                onPlayMedia({
                                  id: file.path,
                                  name: file.name,
                                  path: file.path,
                                  category: 'movies',
                                  size: file.size,
                                  sizeBytes: file.sizeBytes,
                                  date: file.modifiedDate,
                                  type: 'file',
                                  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
                                  thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
                                });
                              }
                            }}
                            className="p-1.5 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-400 hover:text-cyan-200 transition-colors"
                            title="Stream on BDIX Video Player"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onDownloadFile(file)}
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Direct BDIX Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => handleCopyFtpUrl(file.path, e)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Copy direct FTP URL"
                        >
                          {copiedPath === file.path ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {(!currentNode.children || currentNode.children.length === 0) && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  Directory is empty. No files found in {currentPath}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Directory Footer Info */}
      <div className="bg-slate-950/90 px-4 py-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-slate-400 font-mono text-[11px]">
        <span>Apache/2.4.58 (Ubuntu) Server at ftp.neonbadda.bd Port 21 / 80</span>
        <span className="text-cyan-400">Total Storage: 320 TB (ZFS RAID-Z2 Array)</span>
      </div>
    </div>
  );
};
