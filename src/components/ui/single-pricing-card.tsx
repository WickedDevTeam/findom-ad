
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { LucideIcon } from "lucide-react"
import { Star } from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export interface Testimonial {
  id: number
  name: string
  role: string
  company?: string
  content: string
  rating: number
  avatar: string
}

export interface Feature {
  text: string
}

export interface Benefit {
  text: string
  icon: LucideIcon
}

export interface SinglePricingCardProps {
  badge?: {
    icon: LucideIcon
    text: string
  }
  title: string
  subtitle: string
  price: {
    current: string
    original?: string
    discount?: string
    discountBadgeClassName?: string
  }
  benefits: Benefit[]
  features: Feature[]
  featuresIcon: LucideIcon
  featuresTitle?: string
  featuresBadge?: {
    icon: LucideIcon
    text: string
  }

  primaryButton: {
    text: string
    icon: LucideIcon
    href?: string
    onClick?: () => void
    chevronIcon?: LucideIcon
  }
  secondaryButton?: {
    text: string
    icon: LucideIcon
    href?: string
    onClick?: () => void
  }

  testimonials: Testimonial[]
  testimonialRotationSpeed?: number // in milliseconds

  animationEnabled?: boolean
  className?: string
  cardClassName?: string
  maxWidth?: string
}

export function SinglePricingCard({
  badge,
  title,
  subtitle,
  price,
  benefits,
  features,
  featuresIcon,
  featuresTitle = "Included Features",
  featuresBadge,
  primaryButton,
  secondaryButton,
  testimonials,
  testimonialRotationSpeed = 5000,
  animationEnabled = true,
  className,
  cardClassName,
  maxWidth = "max-w-2xl",
}: SinglePricingCardProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, testimonialRotationSpeed)

    return () => clearInterval(interval)
  }, [testimonials.length, testimonialRotationSpeed])

  return (
    <div ref={sectionRef} className={`py-12 relative overflow-hidden ${className || ""}`}>
      <div className={`container px-4 md:px-6 relative z-10 mx-auto ${maxWidth}`}>
        {animationEnabled ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SinglePricingCardContent
              badge={badge}
              title={title}
              subtitle={subtitle}
              price={price}
              benefits={benefits}
              features={features}
              featuresIcon={featuresIcon}
              featuresTitle={featuresTitle}
              featuresBadge={featuresBadge}
              primaryButton={primaryButton}
              secondaryButton={secondaryButton}
              testimonials={testimonials}
              currentTestimonialIndex={currentTestimonialIndex}
              isInView={isInView}
              animationEnabled={animationEnabled}
              cardClassName={cardClassName}
            />
          </motion.div>
        ) : (
          <SinglePricingCardContent
            badge={badge}
            title={title}
            subtitle={subtitle}
            price={price}
            benefits={benefits}
            features={features}
            featuresIcon={featuresIcon}
            featuresTitle={featuresTitle}
            featuresBadge={featuresBadge}
            primaryButton={primaryButton}
            secondaryButton={secondaryButton}
            testimonials={testimonials}
            currentTestimonialIndex={currentTestimonialIndex}
            isInView={isInView}
            animationEnabled={animationEnabled}
            cardClassName={cardClassName}
          />
        )}
      </div>
    </div>
  )
}

interface SinglePricingCardContentProps
  extends Omit<SinglePricingCardProps, "className" | "maxWidth" | "testimonialRotationSpeed"> {
  currentTestimonialIndex: number
  isInView: boolean
  cardClassName?: string
}

function SinglePricingCardContent({
  badge,
  title,
  subtitle,
  price,
  benefits,
  features,
  featuresIcon,
  featuresTitle,
  featuresBadge,
  primaryButton,
  secondaryButton,
  testimonials,
  currentTestimonialIndex,
  isInView,
  animationEnabled,
  cardClassName,
}: SinglePricingCardContentProps) {
  const BadgeIcon = badge?.icon
  const FeaturesBadgeIcon = featuresBadge?.icon
  const FeaturesIcon = featuresIcon
  const PrimaryButtonIcon = primaryButton.icon
  const ChevronIcon = primaryButton.chevronIcon
  const SecondaryButtonIcon = secondaryButton?.icon

  return (
    <Card className={`overflow-hidden border border-primary/10 relative group bg-findom-dark text-white ${cardClassName || ""}`}>
      {animationEnabled && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-findom-orange/5 via-findom-purple/10 to-transparent" />
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Left column - Pricing details */}
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col">
          {badge && (
            <div className="flex items-center mb-4">
              <Badge className="px-3 py-1 bg-findom-purple/10 border-findom-purple/30 text-findom-purple">
                {BadgeIcon && <BadgeIcon className="h-3.5 w-3.5 mr-1" />}
                <span>{badge.text}</span>
              </Badge>
            </div>
          )}

          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-findom-purple/80 mb-4">{subtitle}</p>

          <div className="flex items-baseline mb-6">
            <span className="text-4xl font-bold text-findom-orange">{price.current}</span>
            {price.original && <span className="text-findom-purple/50 ml-2 line-through">{price.original}</span>}
            {price.discount && (
              <Badge
                variant="outline"
                className={`ml-3 border-green-400/30 text-green-400 ${price.discountBadgeClassName || ""}`}
              >
                <span>{price.discount}</span>
              </Badge>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon

              return (
                <div key={index} className="flex items-center gap-2">
                  <BenefitIcon className="h-4 w-4 text-findom-orange" />
                  <span className="text-sm">{benefit.text}</span>
                </div>
              )
            })}
          </div>

          <div className="mt-auto space-y-3">
            <Button
              className="w-full gap-2 group !bg-findom-orange text-white"
              size="lg"
              onClick={primaryButton.onClick}
              asChild={!!primaryButton.href}
            >
              {primaryButton.href ? (
                <a href={primaryButton.href}>
                  <PrimaryButtonIcon className="h-4 w-4" />
                  <span>{primaryButton.text}</span>
                  {ChevronIcon && (
                    <ChevronIcon className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1" />
                  )}
                </a>
              ) : (
                <>
                  <PrimaryButtonIcon className="h-4 w-4" />
                  <span>{primaryButton.text}</span>
                  {ChevronIcon && (
                    <ChevronIcon className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1" />
                  )}
                </>
              )}
            </Button>

            {secondaryButton && (
              <Button
                variant="outline"
                className="w-full gap-2 border-findom-purple/40 text-findom-purple"
                size="lg"
                onClick={secondaryButton.onClick}
                asChild={!!secondaryButton.href}
              >
                {secondaryButton.href ? (
                  <a href={secondaryButton.href} target="_blank" rel="noopener">
                    <span>{secondaryButton.text}</span>
                    <SecondaryButtonIcon className="h-4 w-4 ml-auto" />
                  </a>
                ) : (
                  <>
                    <span>{secondaryButton.text}</span>
                    <SecondaryButtonIcon className="h-4 w-4 ml-auto" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Right column - Features */}
        <div className="p-6 md:p-8 md:w-1/2 md:border-l border-findom-purple/20">
          <div className="flex items-center mb-4">
            <h4 className="font-semibold">{featuresTitle}</h4>
            {featuresBadge && FeaturesBadgeIcon && (
              <Badge className="ml-2 px-2 py-1 bg-findom-orange/10 border-findom-orange/30 text-findom-orange">
                <FeaturesBadgeIcon className="h-3 w-3 mr-1" />
                <span>{featuresBadge.text}</span>
              </Badge>
            )}
          </div>

          <div className="space-y-3 mb-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={animationEnabled ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                animate={animationEnabled && isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-findom-purple/15">
                  <FeaturesIcon className="h-3 w-3 text-findom-purple" />
                </div>
                <span className="text-sm">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {testimonials.length > 0 && (
            <>
              <Separator className="my-6 border-findom-purple/20" />

              <div className="rounded-lg p-4 border border-findom-purple/20 relative overflow-hidden min-h-[140px] bg-findom-dark/70">
                <AnimatePresence mode="wait">
                  {testimonials.map(
                    (testimonial, index) =>
                      index === currentTestimonialIndex && (
                        <motion.div
                          key={testimonial.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 p-4"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              <img
                                src={testimonial.avatar || "/placeholder.svg"}
                                alt={`${testimonial.name}'s avatar`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{testimonial.name}</p>
                              <p className="text-xs text-findom-purple/70">
                                {testimonial.role}
                                {testimonial.company && ` at ${testimonial.company}`}
                              </p>
                            </div>
                            <div className="ml-auto flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-findom-orange text-findom-orange" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm italic">{testimonial.content}</p>
                        </motion.div>
                      ),
                  )}
                </AnimatePresence>
              </div>

              {testimonials.length > 1 && (
                <div className="flex justify-center mt-4 gap-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentTestimonialIndex ? "w-4 bg-findom-orange" : "w-1.5 bg-findom-purple/40"
                      }`}
                      onClick={() => {
                        // Only allow changing manually if testimonials exist
                        if (testimonials.length > 1) {
                          (window as any).setCurrentTestimonialIndex
                            ? (window as any).setCurrentTestimonialIndex(index)
                            : null
                        }
                      }}
                      aria-label={`View testimonial ${index + 1}`}
                      type="button"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
