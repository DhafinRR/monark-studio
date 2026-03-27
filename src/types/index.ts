export type PackageType = "basic_web" | "web_app_cms" | "mobile_app";

export type OrderStatus = "new" | "contacted" | "dealing" | "closed";

export interface PricingFeature {
  text: string;
}

export interface PricingPackage {
  id: PackageType;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  target: string;
  features: PricingFeature[];
  highlighted?: boolean;
}

export interface Order {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  packageType: PackageType;
  details: string;
  status: OrderStatus;
  createdAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
  tags: string[];
  createdAt: string;
}
