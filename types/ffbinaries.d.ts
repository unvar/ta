export interface Location {
  found: boolean
  isExecutable: boolean
  path: string
  version: string
}

export function clearCache(): void;
export function detectPlatform(osinfo: any): any;
export function downloadBinaries(components: string[], opts: {
  quiet: boolean,
  destination: string,
}, callback: (err?: Error) => void): void;
export function downloadFiles(components: any, opts: any, callback: any): void;
export function getBinaryFilename(component: any, platform: any): any;
export function getVersionData(version: any, callback: any): any;
export function listPlatforms(): any;
export function listVersions(callback: any): any;
export function locateBinariesSync(components: string[], opts: {
  paths: string[],
  ensureExecutable: boolean,
}): {
  ffmpeg?: Location,
  ffprobe?: Location
};
export function resolvePlatform(input: any): any;
