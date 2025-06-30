export type ProductKey = 
  | "Marine Cargo Policy"
  | "Private Motor Insurance"
  | "Student/Personal Accident Cover"
  | "Motor Commercial"
  | "Golfers/Sportsman Insurance"
  | "Family Medisure"
  | "CIC Seniors Plan"

export interface ProductDetails {
  description: string;
  image: string;
}

export const PRODUCT_DETAILS: Record<ProductKey, ProductDetails> = {
  "Marine Cargo Policy": {
    description: "Comprehensive coverage for your cargo shipments by sea, land, or air.",
    image: "/assets/products/marine.svg"
  },
  "Private Motor Insurance": {
    description: "Protect your personal vehicle with our comprehensive motor insurance.",
    image: "/assets/products/fast.svg"
  },
  "Student/Personal Accident Cover": {
    description: "Safety net for students and individuals against accidents and injuries.",
    image: "/assets/products/pa.svg"
  },
  "Motor Commercial": {
    description: "Insurance solutions for commercial vehicles and fleets.",
    image: "/assets/products/lorry.svg"
  },
  "Golfers/Sportsman Insurance": {
    description: "Specialized coverage for sports equipment and liability for golfers and athletes.",
    image: "/assets/products/golfer.svg"
  },
  "Family Medisure": {
    description: "Healthcare coverage for your entire family's medical needs.",
    image: "/assets/products/health-active.svg"
  },
  "CIC Seniors Plan": {
    description: "Tailored insurance solutions for senior citizens.",
    image: "/assets/products/seniors.svg"
  }
};
