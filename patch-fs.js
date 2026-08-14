const fs = require('fs');

const origReadlink = fs.readlink;
const origReadlinkSync = fs.readlinkSync;

fs.readlink = function (path, options, callback) {
  const cb = typeof options === 'function' ? options : callback;
  const opts = typeof options === 'function' ? undefined : options;

  const handleResult = (err, linkString) => {
    if (err && err.code === 'EISDIR') {
      const einvalErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      einvalErr.code = 'EINVAL';
      einvalErr.errno = -4071;
      einvalErr.syscall = 'readlink';
      einvalErr.path = path;
      return cb(einvalErr, undefined);
    }
    return cb(err, linkString);
  };

  return opts !== undefined
    ? origReadlink(path, opts, handleResult)
    : origReadlink(path, handleResult);
};

fs.readlinkSync = function (path, options) {
  try {
    return origReadlinkSync(path, options);
  } catch (err) {
    if (err && err.code === 'EISDIR') {
      const einvalErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
      einvalErr.code = 'EINVAL';
      einvalErr.errno = -4071;
      einvalErr.syscall = 'readlink';
      einvalErr.path = path;
      throw einvalErr;
    }
    throw err;
  }
};

if (fs.promises && fs.promises.readlink) {
  const origPromisesReadlink = fs.promises.readlink;
  fs.promises.readlink = async function (path, options) {
    try {
      return await origPromisesReadlink.call(fs.promises, path, options);
    } catch (err) {
      if (err && err.code === 'EISDIR') {
        const einvalErr = new Error(`EINVAL: invalid argument, readlink '${path}'`);
        einvalErr.code = 'EINVAL';
        einvalErr.errno = -4071;
        einvalErr.syscall = 'readlink';
        einvalErr.path = path;
        throw einvalErr;
      }
      throw err;
    }
  };
}
