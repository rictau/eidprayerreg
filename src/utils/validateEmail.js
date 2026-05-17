const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

const COMMON_DOMAIN_TYPOS = {
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.om": "gmail.com",
  "gmail.coom": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yaho.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "hotnail.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlook.con": "outlook.com",
  "icloud.co": "icloud.com",
  "icloud.con": "icloud.com",
};

export function validateEmail(rawEmail) {
  const email = (rawEmail || "").trim();

  if (!email) {
    return {
      valid: false,
      message: "Email wajib diisi. (メールアドレスを入力してください。)",
    };
  }

  if (email.length > 254) {
    return {
      valid: false,
      message: "Email terlalu panjang. (メールアドレスが長すぎます。)",
    };
  }

  if (!EMAIL_REGEX.test(email)) {
    return {
      valid: false,
      message: "Format email tidak valid. (無効なメール形式です)",
    };
  }

  const [localPart, domain] = email.split("@");

  if (localPart.length > 64) {
    return {
      valid: false,
      message: "Format email tidak valid. (無効なメール形式です)",
    };
  }

  if (
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..") ||
    domain.includes("..")
  ) {
    return {
      valid: false,
      message: "Format email tidak valid. (無効なメール形式です)",
    };
  }

  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2 || !/^[A-Za-z]+$/.test(tld)) {
    return {
      valid: false,
      message: "Domain email tidak valid. (メールドメインが無効です。)",
    };
  }

  const lowerDomain = domain.toLowerCase();
  let suggestion = COMMON_DOMAIN_TYPOS[lowerDomain];
  if (!suggestion && lowerDomain.endsWith(".con")) {
    suggestion = lowerDomain.slice(0, -4) + ".com";
  }
  if (suggestion) {
    return {
      valid: false,
      message: `Apakah maksud Anda ${localPart}@${suggestion}? (${localPart}@${suggestion} のことですか？)`,
    };
  }

  return { valid: true, email };
}
