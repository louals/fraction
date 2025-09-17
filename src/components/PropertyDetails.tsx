// src/components/PropertyDetails.tsx
import {
  Home,
  BedDouble,
  Bath,
  MapPin,
  Calendar,
  CheckCircle2,
  Train,
  VolumeX,
  GraduationCap,
  Trees,
  Activity,
} from 'lucide-react';
import React from 'react';

export default function PropertyDetails() {
  return (
    <section className="p-0">
      {/* Titre de la section */}
      <h2 className="text-2xl font-semibold text-fraction-violet-500">
        Information
      </h2>

      {/* Ligne de résumé */}
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <InfoPill icon={<Home className="h-4 w-4" />} label="8 Rooms" />
        <InfoPill icon={<BedDouble className="h-4 w-4" />} label="4 Bedrooms" />
        <InfoPill icon={<Bath className="h-4 w-4" />} label="2 Bathrooms" />
        <InfoPill
          icon={<MapPin className="h-4 w-4" />}
          label="1925 Maplewood Avenue, Toronto, ON M5V 3K9, Canada"
          className="truncate max-w-[48ch]"
        />

        <div className="ml-auto flex items-center gap-8 text-fraction-gray-500">
          <span className="whitespace-nowrap flex items-center gap-2">
            <Calendar className="h-4 w-4 text-fraction-violet-300" />
            <span className="text-fraction-gray-600">
              Year of construction:
            </span>
            <strong className="text-fraction-gray-700 ml-1">2020</strong>
          </span>
          <span className="whitespace-nowrap flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-fraction-violet-300" />
            <span className="text-fraction-gray-600">Status:</span>
            <strong className="text-fraction-gray-700 ml-1">Available</strong>
          </span>
        </div>
      </div>

      {/* Lien vers le quartier */}
      <div className="mt-6">
        <a
          href="#neighborhood"
          className="text-2xl font-semibold text-fraction-violet-500"
        >
          Neighborhood Overview
        </a>
      </div>

      {/* Caractéristiques */}
      <div className="mt-6 grid grid-cols-1 gap-8 text-fraction-gray-700 sm:grid-cols-2 lg:grid-cols-5">
        <FeatureItem
          icon={<Train className="h-5 w-5" />}
          title="Public transport access"
          sub={
            <>
              <span>Bus</span>
              <br />
              <span>Subway</span>
              <br />
              <span>Train</span>
            </>
          }
        />

        <FeatureItem icon={<VolumeX className="h-5 w-5" />} title="Silence" />

        <FeatureItem
          icon={<GraduationCap className="h-5 w-5" />}
          title="Nearby schools"
          sub={
            <>
              High school
              <br />
              Elementary
              <br />
              Kindergarten
            </>
          }
        />

        <FeatureItem
          icon={<Trees className="h-5 w-5" />}
          title="Nearby parks"
        />

        <FeatureItem
          icon={<Activity className="h-5 w-5" />}
          title="Walk score"
          sub="81"
        />
      </div>
    </section>
  );
}

function InfoPill({
  icon,
  label,
  className = '',
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-fraction-gray-400">{icon}</span>
      <span className="text-fraction-gray-600">{label}</span>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fraction-light-100 text-fraction-gray-600 ring-1 ring-fraction-light-300">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-fraction-gray-700">
          {title}
        </div>
        {sub ? (
          <div className="mt-1 text-xs leading-5 text-fraction-gray-500">
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
}
