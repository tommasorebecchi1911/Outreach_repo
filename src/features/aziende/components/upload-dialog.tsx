import { useCallback, useState } from 'react'
import { FileSpreadsheet, Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUploadExcel } from '../data/hooks'

type UploadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const uploadExcel = useUploadExcel()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile)
    } else {
      toast.error('Please upload an .xls or .xlsx file')
    }
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile && isValidFile(selectedFile)) {
        setFile(selectedFile)
      } else {
        toast.error('Please upload an .xls or .xlsx file')
      }
    },
    []
  )

  const handleUpload = async () => {
    if (!file) return

    try {
      await uploadExcel.mutateAsync(file)
      toast.success('File uploaded successfully! Companies are being processed.')
      setFile(null)
      onOpenChange(false)
    } catch {
      toast.error('Failed to upload file. Please try again.')
    }
  }

  const handleClose = () => {
    setFile(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Upload Excel File</DialogTitle>
          <DialogDescription>
            Upload an .xls or .xlsx file containing company data. Required
            columns: <strong>nome_azienda</strong> and{' '}
            <strong>partita_iva</strong>.
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {file ? (
            <div className='flex items-center gap-3'>
              <FileSpreadsheet className='size-10 text-green-600' />
              <div className='flex-1'>
                <p className='text-sm font-medium'>{file.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                className='size-8'
                onClick={(e) => {
                  e.stopPropagation()
                  setFile(null)
                }}
              >
                <X className='size-4' />
              </Button>
            </div>
          ) : (
            <>
              <Upload className='mb-2 size-10 text-muted-foreground' />
              <p className='text-sm font-medium'>
                Drag & drop your Excel file here
              </p>
              <p className='text-xs text-muted-foreground'>
                or click to browse (.xls, .xlsx)
              </p>
            </>
          )}
          <input
            id='file-upload'
            type='file'
            accept='.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            className='hidden'
            onChange={handleFileChange}
          />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploadExcel.isPending}
          >
            {uploadExcel.isPending ? (
              <Loader2 className='animate-spin' />
            ) : (
              <Upload className='size-4' />
            )}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function isValidFile(file: File): boolean {
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ]
  const validExtensions = ['.xls', '.xlsx']
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
  return validTypes.includes(file.type) || validExtensions.includes(ext)
}
