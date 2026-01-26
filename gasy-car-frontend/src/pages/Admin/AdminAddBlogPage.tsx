import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBlogPost } from "@/useQuery/useBlogQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ArrowLeft, Save, Loader2, X } from "lucide-react";
import { BlogSection, BlogSectionLayout, CreateBlogPayload } from "@/types/blogTypes";
import { toast } from "sonner";

const DEFAULT_SECTION: Omit<BlogSection, "id"> = {
  order: 0,
  layout: "FULL",
  title: "",
  body: "",
  image: "",
  list_items: [],
  cta_label: "",
  cta_url: "",
  highlight_label: "",
};

export default function AdminAddBlogPage() {
  const navigate = useNavigate();

  // Queries & Mutations
  const createMutation = useCreateBlogPost();

  // Form State
  const [formData, setFormData] = useState<CreateBlogPayload>({
    title: "",
    subtitle: "",
    slug: "",
    cover_image: "",
    excerpt: "",
    is_published: false,
    sections: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_published: checked }));
  };

  // Image Upload Handlers
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, cover_image: file }));
  };

  const handleSectionImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateSection(index, "image", file);
  };

  const removeCoverImage = () => {
    setFormData((prev) => ({ ...prev, cover_image: "" }));
  };

  const removeSectionImage = (index: number) => {
    updateSection(index, "image", "");
  };

  // Section Management
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { ...DEFAULT_SECTION, order: prev.sections.length },
      ],
    }));
  };

  const removeSection = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const updateSection = (index: number, field: keyof Omit<BlogSection, "id">, value: any) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const handleListItemsChange = (index: number, value: string) => {
    // Split by new line to create array
    const items = value.split("\n").filter((item) => item.trim() !== "");
    updateSection(index, "list_items", items);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Article créé avec succès");
      navigate("/admin/blogs");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    }
  };

  const getImageSrc = (image: File | string | null | undefined) => {
    if (!image) return "";
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      return `${import.meta.env.VITE_MEDIA_BASE_URL ?? ""}${image}`;
    }
    return URL.createObjectURL(image);
  };

  return (
    <div className="container mx-auto py-10 max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/blogs")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Nouvel article</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Titre de l'article"
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
               <Label htmlFor="subtitle">Sous-titre</Label>
               <Input
                 id="subtitle"
                 name="subtitle"
                 value={formData.subtitle}
                 onChange={handleChange}
                 placeholder="Sous-titre (optionnel)"
               />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                placeholder="mon-super-article"
              />
            </div>

            <div className="space-y-2">
              <Label>Image de couverture</Label>
              {formData.cover_image ? (
                <div className="relative mt-2 h-40 w-full overflow-hidden rounded-md border">
                  <img
                    src={getImageSrc(formData.cover_image)}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6"
                    onClick={removeCoverImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="excerpt">Extrait</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt || ""}
                onChange={handleChange}
                placeholder="Bref résumé de l'article..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="is_published">Publier cet article</Label>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Sections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Sections</h2>
            <Button type="button" onClick={addSection} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une section
            </Button>
          </div>

          {formData.sections.map((section, index) => (
            <Card key={index} className="relative">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => removeSection(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardHeader>
                <CardTitle className="text-lg">Section {index + 1}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Disposition</Label>
                  <Select
                    value={section.layout}
                    onValueChange={(val) => updateSection(index, "layout", val as BlogSectionLayout)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL">Pleine largeur</SelectItem>
                      <SelectItem value="IMAGE_LEFT">Image à gauche</SelectItem>
                      <SelectItem value="IMAGE_RIGHT">Image à droite</SelectItem>
                      <SelectItem value="QUOTE">Citation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Titre de section</Label>
                  <Input
                    value={section.title || ""}
                    onChange={(e) => updateSection(index, "title", e.target.value)}
                    placeholder="Titre..."
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Contenu</Label>
                  <Textarea
                    value={section.body || ""}
                    onChange={(e) => updateSection(index, "body", e.target.value)}
                    placeholder="Contenu de la section..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image</Label>
                  {section.image ? (
                    <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md border">
                      <img
                        src={getImageSrc(section.image)}
                        alt="Section"
                        className="h-full w-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6"
                        onClick={() => removeSectionImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSectionImageUpload(index, e)}
                        className="cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Label Badge (optionnel)</Label>
                  <Input
                    value={section.highlight_label || ""}
                    onChange={(e) => updateSection(index, "highlight_label", e.target.value)}
                    placeholder="Ex: Nouveau"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Liste à puces (un élément par ligne)</Label>
                  <Textarea
                    value={section.list_items?.join("\n") || ""}
                    onChange={(e) => handleListItemsChange(index, e.target.value)}
                    placeholder="Élément 1&#10;Élément 2&#10;Élément 3"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                   <Label>CTA Label</Label>
                   <Input
                     value={section.cta_label || ""}
                     onChange={(e) => updateSection(index, "cta_label", e.target.value)}
                     placeholder="En savoir plus"
                   />
                </div>
                
                <div className="space-y-2">
                   <Label>CTA URL</Label>
                   <Input
                     value={section.cta_url || ""}
                     onChange={(e) => updateSection(index, "cta_url", e.target.value)}
                     placeholder="https://..."
                   />
                </div>
              </CardContent>
            </Card>
          ))}
          
          {formData.sections.length === 0 && (
             <div className="text-center py-10 border-2 border-dashed rounded-xl text-muted-foreground">
                Aucune section ajoutée. Commencez par ajouter du contenu.
             </div>
          )}
        </div>

        <div className="sticky bottom-6 flex justify-end">
          <Button type="submit" size="lg" disabled={createMutation.isPending}>
            {createMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Save className="mr-2 h-4 w-4" />
            Enregistrer l'article
          </Button>
        </div>
      </form>
    </div>
  );
}
