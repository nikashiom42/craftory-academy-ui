import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";

/**
 * 404 Not Found page
 * Displays error message and provides navigation back to home
 */
const NotFound = () => {
  return (
    <>
      <SEO
        title="404 - გვერდი ვერ მოიძებნა | Craftory Academy"
        description="გვერდი ვერ მოიძებნა. დაბრუნდით მთავარ გვერდზე ან გამოიყენეთ ნავიგაცია."
        noindex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">გვერდი ვერ მოიძებნა</p>
        <p className="mb-6 text-gray-500">გვერდი, რომელსაც ეძებთ, არ არსებობს ან გადაადგილებულია.</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          დაბრუნება მთავარ გვერდზე
        </Link>
      </div>
    </div>
    </>
  );
};

export default NotFound;
