const Footer = () => {
  return (
    <footer className="mb-2 sm:mb-0">
      <hr className="my-6 border-gray-200  dark:border-gray-700" />
      <span className="block text-sm text-gray-500 sm:text-center">
        Built by{" "}
        <a
          href="https://twitter.com/f1m1han"
          className="hover:underline font-bold"
          target="_blank"
        >
          Champion
        </a>
        . Source code available on{" "}
        <a
          href="https://github.com/ayofimihan/faucet"
          className="hover:underline font-bold"
          target="_blank"
        >
          Github
        </a>{" "}
      </span>
    </footer>
  );
};

export default Footer;
