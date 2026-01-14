import { useState, useMemo } from 'react';
import { Search, FileText, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useSearchDocuments } from '../hooks/useDocuments';
import type { DocumentType } from '../types/document.types';

// Query quality evaluator
function evaluateQuery(query: string): {
  score: number;
  strength: 'weak' | 'medium' | 'strong';
  feedback: string;
  color: string;
  icon: typeof TrendingUp;
} {
  const trimmedQuery = query.trim();
  const words = trimmedQuery.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Check for question words
  const questionWords = ['qué', 'cuál', 'cómo', 'dónde', 'cuándo', 'quién', 'por qué', 'para qué'];
  const hasQuestionWord = questionWords.some(qw => trimmedQuery.toLowerCase().includes(qw));

  // Calculate score
  let score = 0;

  if (wordCount === 0) {
    return {
      score: 0,
      strength: 'weak',
      feedback: 'Escribe tu consulta',
      color: 'text-muted-foreground',
      icon: Minus
    };
  }

  // Single word = weak
  if (wordCount === 1) {
    return {
      score: 20,
      strength: 'weak',
      feedback: 'Consulta muy vaga. Usa frases descriptivas',
      color: 'text-red-500',
      icon: TrendingDown
    };
  }

  // Score based on word count
  if (wordCount >= 2 && wordCount <= 3) score = 40;
  if (wordCount >= 4 && wordCount <= 6) score = 70;
  if (wordCount >= 7) score = 85;

  // Bonus for question words
  if (hasQuestionWord) score += 15;

  // Cap at 100
  score = Math.min(score, 100);

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong';
  let feedback: string;
  let color: string;
  let icon: typeof TrendingUp;

  if (score < 40) {
    strength = 'weak';
    feedback = 'Consulta débil. Agrega más contexto';
    color = 'text-red-500';
    icon = TrendingDown;
  } else if (score < 70) {
    strength = 'medium';
    feedback = 'Consulta aceptable. Puedes ser más específico';
    color = 'text-yellow-500';
    icon = Minus;
  } else {
    strength = 'strong';
    feedback = 'Excelente consulta semántica';
    color = 'text-green-500';
    icon = TrendingUp;
  }

  return { score, strength, feedback, color, icon };
}

export function DocumentSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType | 'all'>('all');
  const [threshold, setThreshold] = useState([0.5]);
  const [limit, setLimit] = useState('10');

  const searchDocuments = useSearchDocuments();

  // Evaluate query quality in real-time
  const queryQuality = useMemo(() => evaluateQuery(query), [query]);

  const handleSearch = () => {
    if (!query.trim()) return;

    searchDocuments.mutate({
      query: query.trim(),
      params: {
        limit: parseInt(limit),
        threshold: threshold[0],
        documentType: documentType !== 'all' ? documentType : undefined,
      },
    });
  };

  const results = searchDocuments.data?.results || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="mr-2 h-4 w-4" />
          Semantic Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Semantic Document Search</DialogTitle>
          <DialogDescription>
            Search across all indexed documents using AI-powered semantic search.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ej: ¿Cuál es el horario de entrega?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={searchDocuments.isPending || !query.trim()}>
                {searchDocuments.isPending ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {/* Query Quality Indicator */}
            {query.trim() && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <queryQuality.icon className={`h-4 w-4 ${queryQuality.color}`} />
                  <span className={`font-medium ${queryQuality.color}`}>
                    Calidad: {queryQuality.score}%
                  </span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className={queryQuality.color}>{queryQuality.feedback}</span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-doc-type">Document Type</Label>
              <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType | 'all')}>
                <SelectTrigger id="search-doc-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="faq">FAQ</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search-limit">Results Limit</Label>
              <Select value={limit} onValueChange={setLimit}>
                <SelectTrigger id="search-limit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 results</SelectItem>
                  <SelectItem value="10">10 results</SelectItem>
                  <SelectItem value="20">20 results</SelectItem>
                  <SelectItem value="50">50 results</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Umbral de similitud</Label>
                <span className="text-xs text-muted-foreground">
                  {(threshold[0] * 100).toFixed(0)}%
                </span>
              </div>
              <Slider
                value={threshold}
                onValueChange={setThreshold}
                min={0}
                max={1}
                step={0.05}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground">
                {queryQuality.strength === 'strong'
                  ? 'Recomendado: 50-70% para consultas fuertes'
                  : queryQuality.strength === 'medium'
                  ? 'Recomendado: 40-60% para consultas medias'
                  : 'Recomendado: 30-40% para consultas débiles'}
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-auto space-y-3">
            {searchDocuments.isPending ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Sparkles className="h-8 w-8 animate-pulse mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Searching documents...</p>
                </div>
              </div>
            ) : searchDocuments.isSuccess && results.length === 0 ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>No results found</EmptyTitle>
                  <EmptyDescription>
                    Try adjusting your search query or lowering the similarity threshold
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : searchDocuments.isSuccess ? (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </div>
                {results.map((result, index) => (
                  <Card key={index} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="font-medium truncate">{result.title}</p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">
                        {result.document_type}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {result.content}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Relevance</span>
                          <span className="text-xs font-medium">{(result.similarity * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={result.similarity * 100} className="h-1" />
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
