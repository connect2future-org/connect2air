import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import * as THREE from 'three';
import { ACCEPTED_MIME, ACCEPT_ATTRIBUTE, MAX_UPLOAD_BYTES } from '../../utils/constants';

export interface ScreenUploadValue {
  /** Current image texture (null → default LED artwork is used). */
  texture: THREE.Texture | null;
  /** width / height of the uploaded image, or null. */
  aspect: number | null;
  /** Original file name for the status bar. */
  fileName: string | null;
  /** Human readable error, if any. */
  error: string | null;
  /** Opens the native file picker. */
  openPicker: () => void;
  /** Removes the uploaded image and returns to the default artwork. */
  clear: () => void;
}

const ScreenUploadContext = createContext<ScreenUploadValue | null>(null);

export function useScreenUpload(): ScreenUploadValue {
  const ctx = useContext(ScreenUploadContext);

  if (!ctx) {
    throw new Error(
      'useScreenUpload() must be used inside <ScreenUploadProvider>.',
    );
  }

  return ctx;
}

interface ProviderProps {
  children: ReactNode;
}

export function ScreenUploadProvider({ children }: ProviderProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [aspect, setAspect] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<string | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  /* ---------------------------------------------------------------- */

  const releaseCurrent = useCallback(() => {
    if (textureRef.current) {
      textureRef.current.dispose();
      textureRef.current = null;
    }

    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, []);

  // Guarantee disposal on unmount (no texture / blob leaks).
  useEffect(() => releaseCurrent, [releaseCurrent]);

  /* ---------------------------------------------------------------- */

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const clear = useCallback(() => {
    releaseCurrent();
    setTexture(null);
    setAspect(null);
    setFileName(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [releaseCurrent]);

  /* ---------------------------------------------------------------- */

  const loadFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_MIME.includes(file.type as (typeof ACCEPTED_MIME)[number])) {
        setError('Unsupported format — use JPG, PNG or WEBP.');
        return;
      }

      if (file.size > MAX_UPLOAD_BYTES) {
        setError('That image is larger than 10 MB.');
        return;
      }

      const url = URL.createObjectURL(file);
      const loader = new THREE.TextureLoader();

      loader.load(
        url,
        (loaded) => {
          loaded.colorSpace = THREE.SRGBColorSpace;
          loaded.wrapS = THREE.ClampToEdgeWrapping;
          loaded.wrapT = THREE.ClampToEdgeWrapping;
          loaded.minFilter = THREE.LinearMipmapLinearFilter;
          loaded.magFilter = THREE.LinearFilter;
          loaded.generateMipmaps = true;
          loaded.anisotropy = 8;
          loaded.needsUpdate = true;

          // Dispose the previous texture / blob BEFORE swapping refs.
          releaseCurrent();

          urlRef.current = url;
          textureRef.current = loaded;

          const image = loaded.image as HTMLImageElement | undefined;
          const width = image?.width ?? 1;
          const height = image?.height ?? 1;

          setAspect(height > 0 ? width / height : 1);
          setTexture(loaded);
          setFileName(file.name);
        },
        undefined,
        () => {
          URL.revokeObjectURL(url);
          setError('That image could not be decoded.');
        },
      );
    },
    [releaseCurrent],
  );

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        loadFile(file);
      }
    },
    [loadFile],
  );

  /* ---------------------------------------------------------------- */

  const value = useMemo<ScreenUploadValue>(
    () => ({
      texture,
      aspect,
      fileName,
      error,
      openPicker,
      clear,
    }),
    [texture, aspect, fileName, error, openPicker, clear],
  );

  return (
    <ScreenUploadContext.Provider value={value}>
      {children}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        onChange={onInputChange}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </ScreenUploadContext.Provider>
  );
}