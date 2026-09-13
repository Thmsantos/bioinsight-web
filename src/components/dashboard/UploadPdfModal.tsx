import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, UploadCloud, FileText } from 'lucide-react';
import { reportService } from '@/services/reportService';

interface UploadPdfModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess?: () => void;
}

function UploadPdfModal({ isOpen, onClose, onUploadSuccess }: UploadPdfModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError('Por favor, selecione apenas arquivos no formato PDF.');
                setSelectedFile(null);
                return;
            }
            setError(null);
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        setError(null);

        try {
            await reportService.uploadPdf(selectedFile);
            setSelectedFile(null);
            onClose();
            if (onUploadSuccess) onUploadSuccess();
        } catch {
            setError('Falha ao enviar o arquivo PDF. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div
            data-testid="upload-pdf-modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
        >
            <Card
                data-testid="upload-pdf-modal"
                className="relative w-full max-w-lg p-6 shadow-xl"
            >
                <button
                    data-testid="close-upload-modal-btn"
                    onClick={onClose}
                    disabled={isUploading}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        Upload InBody PDF Report
                    </h2>
                    <p className="text-sm text-slate-500">
                        Selecione o arquivo de bioimpedância para processamento
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition-colors hover:border-brand-500 hover:bg-slate-100/50">
                        <input
                            id="pdf-file-input"
                            type="file"
                            accept=".pdf"
                            data-testid="pdf-file-input"
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                        />

                        <UploadCloud className="mb-2 h-10 w-10 text-brand-600" />

                        <p className="text-sm font-medium text-slate-700">
                            Clique para selecionar ou arraste o PDF aqui
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Apenas arquivos PDF (máx. 10MB)
                        </p>

                        {selectedFile && (
                            <div
                                data-testid="selected-file-info"
                                className="mt-4 flex items-center gap-2 rounded-lg bg-white p-2.5 shadow-sm text-sm text-slate-700 border border-slate-200"
                            >
                                <FileText className="h-4 w-4 text-brand-600" />
                                <span className="truncate max-w-[200px] font-medium">
                                    {selectedFile.name}
                                </span>
                                <span className="text-xs text-slate-400">
                                    ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                                </span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <p data-testid="upload-error-message" className="text-xs text-red-500 font-medium">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            data-testid="cancel-upload-btn"
                            onClick={onClose}
                            disabled={isUploading}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            data-testid="submit-upload-btn"
                            disabled={!selectedFile || isUploading}
                            isLoading={isUploading}
                            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
                        >
                            Processar Relatório
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

export { UploadPdfModal };