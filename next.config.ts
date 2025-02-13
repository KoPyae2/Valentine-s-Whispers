import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the i18n config as we're using middleware for routing
};

export default withNextIntl(nextConfig);
