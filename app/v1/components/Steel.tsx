'use client'
import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
}

const Steel = ({ className, children }: Props) => {
  return (
    <div className={cn(className, ' ')}>
      <article className=" relative flex-1 metal rounded-xl w-full h-full  text-5xl flex items-center justify-center  text-center">
        <p
          style={{
            textShadow:
              '1px 1px 1px #633d26, 0 0 2px #948378, 0 0 0.2px #f3ce89',
            // filter: 'drop-shadow(0 0 0.15rem #b4b1ae)',
          }}
          className="text-[#f37932 ] mix-blend-multiply"
        >
          <div className="metal-dot absolute inset-0"></div>
          {children}
        </p>
      </article>
      <style jsx>{`
        .metal {
          /* box-shadow: inset 0 -3px 10px rgba(0, 0, 0, 0.8),
            inset 0 3px 20px rgba(255, 255, 255, 0.5),
            0 10px 30px rgba(0, 0, 0, 0.7); */
          box-shadow: inset 0 -3px 4px rgba(0, 0, 0, 0.8),
            inset 0 3px 4px rgba(255, 255, 255, 0.5),
            0 4px 5px rgba(0, 0, 0, 0.7);
          /* border-radius: 2px; */
          /* Fresnel effect */
          --fresnel: radial-gradient(
            ellipse at center,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.1) 60%,
            rgba(255, 255, 255, 0) 100%
          );

          /* Micro-surface imperfections */
          /* --scratches: repeating-linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.1) 0px,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 2px,
            transparent 5px
          ); */
          /* background: var(--fresnel), var(--scratches),
    url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAiIGhlaWdodD0iMjUwIj48ZGVmcz48ZmlsdGVyIGlkPSJoYW1tZXJlZCI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuMiAwLjIiIG51bU9jdGF2ZXM9IjQiIHNlZWQ9IjIwIi8+PGZlRGlmZnVzZUxpZ2h0aW5nIGxpZ2h0aW5nLWNvbG9yPSIjZmZmIiBzdXJmYWNlU2NhbGU9IjgiPjxmZURpc3RhbnRMaWdodCBhemltdXRoPSI0NSIgZWxldmF0aW9uPSI2MCIvPjwvZmVEaWZmdXNlTGlnaHRpbmc+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiM1NTUiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjaGFtbWVyZWQpIiBvcGFjaXR5PSIwLjciLz48L3N2Zz4='); */
          background: linear-gradient(
              135deg,
              #e0e0e0 0%,
              #c4c4c4 50%,
              #a0a0a0 100%
            ),
            var(--fresnel),
            url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCI+PGxpbmVhckdyYWRpZW50IGlkPSJsIiBncmFkaWVudFRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2U2ZTZlNiIvPjxzdG9wIG9mZnNldD0iMjAlIiBzdG9wLWNvbG9yPSIjZmZmIi8+PHN0b3Agb2Zmc2V0PSI0MCUiIHN0b3AtY29sb3I9IiNlNmU2ZTYiLz48c3RvcCBvZmZzZXQ9IjYwJSIgc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iODAlIiBzdG9wLWNvbG9yPSIjZjBmMGYwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZTZlNmU2Ii8+PC9saW5lYXJHcmFkaWVudD48cmVjdCBmaWxsPSJ1cmwoI2wpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+');

          /* background: var(--fresnel), var(--scratches),
            url('data:image/svg+xml;base64,...'); */
        }
        .metal::before {
          content: '';
          position: absolute;
          top: 10px;
          right: 10px;
          width: 15px;
          height: 15px;
          border-radius: 100%;

          background: linear-gradient(
            135deg,
            #e0e0e0 0%,
            #c4c4c4 50%,
            #a0a0a0 100%
          );
          box-shadow: inset 0 -3px 4px rgba(0, 0, 0, 0.8),
            inset 0 3px 4px rgba(255, 255, 255, 0.5),
            0 2px 3px rgba(0, 0, 0, 0.7);
        }
        .metal::after {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          width: 15px;
          height: 15px;
          border-radius: 100%;

          background: linear-gradient(
            135deg,
            #e0e0e0 0%,
            #c4c4c4 50%,
            #a0a0a0 100%
          );
          box-shadow: inset 0 -3px 4px rgba(0, 0, 0, 0.8),
            inset 0 3px 4px rgba(255, 255, 255, 0.5),
            0 2px 3px rgba(0, 0, 0, 0.7);
        }
        .metal-dot::after {
          content: '';
          position: absolute;
          bottom: 10px;
          left: 10px;
          width: 15px;
          height: 15px;
          border-radius: 100%;

          background: linear-gradient(
            135deg,
            #e0e0e0 0%,
            #c4c4c4 50%,
            #a0a0a0 100%
          );
          box-shadow: inset 0 -3px 4px rgba(0, 0, 0, 0.8),
            inset 0 3px 4px rgba(255, 255, 255, 0.5),
            0 2px 3px rgba(0, 0, 0, 0.7);
        }
        .metal-dot::before {
          content: '';
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 15px;
          height: 15px;
          border-radius: 100%;

          background: linear-gradient(
            135deg,
            #e0e0e0 0%,
            #c4c4c4 50%,
            #a0a0a0 100%
          );
          box-shadow: inset 0 -3px 4px rgba(0, 0, 0, 0.8),
            inset 0 3px 4px rgba(255, 255, 255, 0.5),
            0 2px 3px rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </div>
  )
}

export default Steel
