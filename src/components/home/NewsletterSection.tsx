
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      toast.success("You’re in!", {
        description: "You’ll get new listings, creator news & hand-picked promos.",
      });
      setEmail("");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="py-14 md:py-20">
      <div className="relative max-w-2xl mx-auto overflow-hidden rounded-2xl border border-findom-purple/40 bg-gradient-to-br from-findom-purple/70 via-black/80 to-black/90 shadow-xl">
        {/* illustration accent */}
        <img
          src="/lovable-uploads/cc1cf14f-a33a-4c79-96bd-0fe5b439f99c.png"
          alt=""
          className="absolute right-0 bottom-0 h-28 opacity-25 z-0 hidden md:block pointer-events-none"
          draggable={false}
        />
        <div className="relative z-10 md:p-12 p-7 flex flex-col items-center text-center gap-5">
          <h2 className="text-white font-bold text-3xl leading-tight mb-1">
            Never miss a <span className="text-findom-green">creator drop</span>
          </h2>
          <p className="text-white/70 text-base mb-2">
            Join our VIP list for the most exclusive new listings, free ad credits & weekly premium picks.
          </p>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-3"
            autoComplete="off"
          >
            <Input
              type="email"
              placeholder="What’s your best email?"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              required
              disabled={loading}
            />
            <Button
              type="submit"
              size="lg"
              className="bg-findom-green text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Joining…" : "Join Free"}
            </Button>
          </form>
          <div className="mt-3 text-xs text-white/50 mb-1">
            No spam. 1-click optout. Only beautiful people allowed 🥂
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;
