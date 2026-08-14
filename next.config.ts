import type { NextConfig } from "next";
import fs from "fs";

// Fix for Windows non-NTFS drive libuv readlink returning EISDIR instead of EINVAL
const origReadlink = fs.readlink;
const origReadlinkSync = fs.readlinkSync;

// @ts-ignore
fs.readlink = function (path: any, options: any, callback?: any) {
  const cb = typeof options === "function" ? options : callback;
  const opts = typeof options === "function" ? undefined : options;

  const handleResult = (err: any, linkString: any) => {
    if (err && err.code === "EISDIR") {
      const einvalErr: any = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      einvalErr.code = "EINVAL";
      einvalErr.errno = -4071;
      einvalErr.syscall = "readlink";
      einvalErr.path = path;
      return cb(einvalErr, undefined);
    }
    return cb(err, linkString);
  };

  return opts !== undefined
    ? origReadlink(path, opts, handleResult)
    : origReadlink(path, handleResult);
};

// @ts-ignore
fs.readlinkSync = function (path: any, options?: any) {
  try {
    return origReadlinkSync(path, options);
  } catch (err: any) {
    if (err && err.code === "EISDIR") {
      const einvalErr: any = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      einvalErr.code = "EINVAL";
      einvalErr.errno = -4071;
      einvalErr.syscall = "readlink";
      einvalErr.path = path;
      throw einvalErr;
    }
    throw err;
  }
};

if (fs.promises && fs.promises.readlink) {
  const origPromisesReadlink = fs.promises.readlink;
  // @ts-ignore
  (fs.promises as any).readlink = async function (path: any, options?: any) {
    try {
      return await origPromisesReadlink.call(fs.promises, path, options);
    } catch (err: any) {
      if (err && err.code === "EISDIR") {
        const einvalErr: any = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        einvalErr.code = "EINVAL";
        einvalErr.errno = -4071;
        einvalErr.syscall = "readlink";
        einvalErr.path = path;
        throw einvalErr;
      }
      throw err;
    }
  };
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
};

export default nextConfig;
