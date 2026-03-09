"use client"

import React from "react"
import { Upload, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UploadCardProps {
  title: string
  subtitle: string
  file: File | null
  url?: string | null
  onPick: (file: File | null) => void
  onClear: () => void
  accept?: string
}

const UploadCard: React.FC<UploadCardProps> = ({
  title,
  subtitle,
  file,
  url,
  onPick,
  onClear,
  accept = "application/pdf,image/*",
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const isImage = (fileName: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName)

  const displayUrl = React.useMemo(() => {
    if (file) return URL.createObjectURL(file)
    if (url) return url.startsWith("http") ? url : `${import.meta.env.VITE_API_BASE_URL}${url}`
    return null
  }, [file, url])

  const fileName = file ? file.name : url ? url.split("/").pop() : ""

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onClear()
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-br from-muted/30 to-transparent">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Drop Zone / Preview */}
        <label className="block cursor-pointer group">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          />
          <div
            className={`
            relative rounded-xl border-2 border-dashed p-4 text-center
            transition-all duration-200 min-h-[160px] flex items-center justify-center
            ${
              file || url
                ? "border-success/50 bg-success/5"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            }
          `}
          >
            {displayUrl && isImage(fileName || "") ? (
              <div className="relative w-full h-32 rounded-lg overflow-hidden">
                <img src={displayUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              </div>
            ) : file || url ? (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <p className="font-medium text-sm text-foreground truncate max-w-[200px] mx-auto">{fileName}</p>
                {file && <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} Ko</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground">Cliquez pour sélectionner</p>
                <p className="text-xs text-muted-foreground/70">PDF ou image (max 10 Mo)</p>
              </div>
            )}
          </div>
        </label>

        <div className="flex gap-2">
          {url && !file && (
            <Button type="button" variant="outline" size="sm" className="gap-1.5 w-full bg-transparent" asChild>
              <a href={displayUrl || ""} target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4" />
                Voir
              </a>
            </Button>
          )}
          {file && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="gap-1.5 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Annuler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default UploadCard
