function timingSafeStrEquals(a, b) {
  let diff = 0;
  for (let i = 0; i < a.length; ++i) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export { timingSafeStrEquals };
