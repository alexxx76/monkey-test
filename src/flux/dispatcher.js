const listeners = {};

export const listen = (action, fn) => {
  listeners[action] = listeners[action] || [];
  listeners[action].push(fn);
};

export const emit = (action, ...data) => {
  const fns = listeners[action];
  if (fns) fns.forEach(fn => fn(...data));
};