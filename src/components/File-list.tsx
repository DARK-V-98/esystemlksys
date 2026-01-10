'use client';
import { File, Trash2, GripVertical } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
  onDragStart: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
  onDragEnter: (e: React.DragEvent<HTMLLIElement>, index: number) => void;
  onDragEnd: () => void;
}

export function FileList({ files, onRemove, onDragStart, onDragEnter, onDragEnd }: FileListProps) {
  // Only enable drag-and-drop if all the necessary handlers are provided.
  const isDraggable = !!(onDragStart && onDragEnter && onDragEnd);

  return (
    <ul className="space-y-2">
      {files.map((file, index) => (
        <li
          key={index}
          draggable={isDraggable}
          onDragStart={isDraggable ? (e) => onDragStart(e, index) : undefined}
          onDragEnter={isDraggable ? (e) => onDragEnter(e, index) : undefined}
          onDragEnd={isDraggable ? onDragEnd : undefined}
          onDragOver={isDraggable ? (e) => e.preventDefault() : undefined}
          className={cn(
            "flex items-center gap-4 p-3 bg-secondary rounded-lg",
            isDraggable && "cursor-grab active:cursor-grabbing"
          )}
        >
          {isDraggable && <GripVertical className="h-5 w-5 text-muted-foreground" />}
          <File className="h-6 w-6 text-primary" />
          <div className="flex-1 truncate">
            <p className="font-semibold text-sm">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => onRemove(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
