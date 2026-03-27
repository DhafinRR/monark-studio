import { useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, updateOrderStatus, getPortfolio, addPortfolioProject, deletePortfolioProject } from "@/lib/store";
import { PACKAGE_LABELS, ORDER_STATUS_LABELS } from "@/config/pricing";
import { Order, OrderStatus, PortfolioProject } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { portfolioFormSchema, PortfolioFormData } from "@/lib/validation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const STATUS_OPTIONS: OrderStatus[] = ["new", "contacted", "dealing", "closed"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-accent/10 text-accent",
  dealing: "bg-yellow-500/10 text-yellow-400",
  closed: "bg-green-500/10 text-green-400",
};

export default function AdminPage() {
  const [tab, setTab] = useState<"orders" | "portfolio">("orders");
  const [orders, setOrders] = useState<Order[]>(getOrders);
  const [portfolio, setPortfolio] = useState<PortfolioProject[]>(getPortfolio);
  const [showForm, setShowForm] = useState(false);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    setOrders(getOrders());
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioFormSchema),
  });

  const onAddProject = (data: PortfolioFormData) => {
    const project = {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      projectUrl: data.projectUrl,
      tags: data.tags.split(",").map((t) => t.trim()),
    };
    addPortfolioProject(project);
    setPortfolio(getPortfolio());
    reset();
    setShowForm(false);
  };

  const onDeleteProject = (id: string) => {
    deletePortfolioProject(id);
    setPortfolio(getPortfolio());
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-display font-bold text-gradient">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("orders")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "orders" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setTab("portfolio")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "portfolio" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Portfolio
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {tab === "orders" && (
          <div>
            <h2 className="text-lg font-display font-bold text-foreground mb-6">
              Order Management ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-sm">Belum ada order masuk.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nama</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Kontak</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Paket</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Detail</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                        <td className="px-4 py-3 font-medium text-foreground">{order.name}</td>
                        <td className="px-4 py-3">
                          <div className="text-foreground">{order.email}</div>
                          <div className="text-muted-foreground text-xs">{order.whatsapp}</div>
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {PACKAGE_LABELS[order.packageType] || order.packageType}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                          {order.details}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer ${STATUS_COLORS[order.status]}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {ORDER_STATUS_LABELS[s]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">
                          {new Date(order.createdAt).toLocaleDateString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "portfolio" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-display font-bold text-foreground">
                Portfolio Manager ({portfolio.length})
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90"
              >
                <Plus size={16} />
                Tambah Proyek
              </button>
            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit(onAddProject)}
                className="rounded-xl border border-border bg-card p-6 mb-8 grid md:grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Judul</label>
                  <input {...register("title")} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">URL Proyek</label>
                  <input {...register("projectUrl")} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {errors.projectUrl && <p className="text-xs text-destructive mt-1">{errors.projectUrl.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">URL Gambar</label>
                  <input {...register("imageUrl")} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  {errors.imageUrl && <p className="text-xs text-destructive mt-1">{errors.imageUrl.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Tags (pisahkan koma)</label>
                  <input {...register("tags")} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Web, E-Commerce" />
                  {errors.tags && <p className="text-xs text-destructive mt-1">{errors.tags.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Deskripsi</label>
                  <textarea {...register("description")} rows={3} className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                    Simpan
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); reset(); }} className="px-6 py-2 rounded-lg border border-border text-foreground text-sm hover:bg-secondary">
                    Batal
                  </button>
                </div>
              </form>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.map((p) => (
                <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <img src={p.imageUrl} alt={p.title} className="w-full aspect-video object-cover" loading="lazy" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display font-bold text-foreground text-sm">{p.title}</h3>
                      <button
                        onClick={() => onDeleteProject(p.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
