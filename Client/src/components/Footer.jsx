export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white/85 dark:border-white/10 dark:bg-[#090a0f]/75">
      <div className="container mx-auto px-4 py-7">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 md:flex-row dark:text-white/55">
          <p>
            &copy; {new Date().getFullYear()} BlogSpace Platform. All rights
            reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
