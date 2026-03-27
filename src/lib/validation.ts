import { z } from "zod";

export const orderFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(255, "Email terlalu panjang"),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Nomor WA minimal 10 digit")
    .max(15, "Nomor WA maksimal 15 digit")
    .regex(/^[0-9+]+$/, "Nomor WA hanya boleh angka dan +"),
  packageType: z.enum(["basic_web", "web_app_cms", "mobile_app"], {
    required_error: "Silakan pilih paket",
  }),
  details: z
    .string()
    .trim()
    .min(10, "Detail kebutuhan minimal 10 karakter")
    .max(1000, "Detail kebutuhan maksimal 1000 karakter"),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

export const portfolioFormSchema = z.object({
  title: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(500),
  imageUrl: z.string().url("URL gambar tidak valid"),
  projectUrl: z.string().url("URL proyek tidak valid"),
  tags: z.string().trim().min(1, "Minimal 1 tag"),
});

export type PortfolioFormData = z.infer<typeof portfolioFormSchema>;
