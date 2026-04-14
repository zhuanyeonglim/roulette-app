import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Info, Video, Calendar, Crown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ClaimSeatSection = React.forwardRef<HTMLDivElement, { onSuccess?: () => void }>((props, ref) => {
  const { onSuccess } = props;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    mobile: '',
    agreed: false
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-04-19T23:59:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('https://services.leadconnectorhq.com/hooks/DfsUTSdZKxCNC7VoSaFx/webhook-trigger/6759ab55-3254-43aa-b8d2-7fe39269cf18', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'Roulette App',
          submittedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', country: '', mobile: '', agreed: false });
        // Redirect to the upgrade page after a short delay
        setTimeout(() => {
          window.location.href = 'https://event.joeyyap.com/aods-upgrade';
        }, 2000);
      } else {
        console.error('Webhook submission failed');
      }
    } catch (error) {
      console.error('Error submitting to webhook:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} className="relative w-full min-h-screen flex flex-col items-center py-24 overflow-hidden bg-[#2a0505]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="https://assets.cdn.filesafe.space/DfsUTSdZKxCNC7VoSaFx/media/69d752374c6acc8ccbe576d7.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a0404] via-transparent to-[#4a0404] z-10" />
      </div>

      <div className="relative z-20 container max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Logo */}
        <motion.img
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DfsUTSdZKxCNC7VoSaFx/media/69d5e336f0a39cf9a336394e.gif"
          alt="Logo"
          className="w-48 md:w-64 mb-16"
        />

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 mb-16"
        >
          <h2 className="text-2xl sm:text-4xl md:text-6xl font-heading font-bold text-white leading-[1.1] tracking-tight">
            Discover The Timing Framework <br className="hidden sm:block" />
            That Turns Good Decisions <br className="hidden sm:block" />
            Into Great Outcomes.
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl mx-auto">
            Same Effort. Completely Different Results. Here's Why Timing Changes Everything.
          </p>
        </motion.div>

        {/* Video Player */}
        <div className="w-full max-w-4xl aspect-video bg-black/60 rounded-2xl border border-white/10 mb-20 relative group overflow-hidden shadow-2xl">
           <video
            key="main-video"
            controls
            playsInline
            preload="auto"
            poster="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DfsUTSdZKxCNC7VoSaFx/media/69d76feacc42ebf317d5d8ef.png"
            className="w-full h-full object-cover"
           >
             <source src="https://assets.cdn.filesafe.space/DfsUTSdZKxCNC7VoSaFx/media/69d74c1da7dcb4cff072cdd6.mp4" type="video/mp4" />
             <source src="/input_file_0.mp4" type="video/mp4" />
             Your browser does not support the video tag.
           </video>
        </div>

        {/* Info Bar */}
        <div className="w-full max-w-5xl bg-[#3d0a0a]/60 border border-[#c5a059]/30 rounded-xl p-4 md:p-6 mb-16 flex flex-wrap justify-center items-center gap-4 md:gap-10 text-[10px] sm:text-xs md:text-sm font-bold text-[#c5a059] uppercase tracking-widest backdrop-blur-md">
          <div className="flex items-center gap-2 shrink-0">
            <Video className="h-4 w-4 opacity-70" />
            <span>Live on Zoom</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-[#c5a059]/20 shrink-0" />
          <div className="flex items-center gap-2 shrink-0">
            <Calendar className="h-4 w-4 opacity-70" />
            <span>20, 22, 24 & 25 April 2026</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-[#c5a059]/20 shrink-0" />
          <div className="flex items-center gap-2 shrink-0">
            <Crown className="h-4 w-4 opacity-70" />
            <span>26 April 2026</span>
          </div>
          <div className="hidden sm:block w-px h-6 bg-[#c5a059]/20 shrink-0" />
          <div className="flex items-center gap-2 shrink-0">
            <Clock className="h-4 w-4 opacity-70" />
            <span>8PM (GMT+8)</span>
          </div>
        </div>

        {/* Countdown */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-10 md:gap-16 mb-20">
          {[
            { label: 'days', value: timeLeft.days },
            { label: 'hours', value: timeLeft.hours },
            { label: 'minutes', value: timeLeft.minutes },
            { label: 'seconds', value: timeLeft.seconds }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center min-w-[60px] sm:min-w-[70px]">
              <span className="text-2xl sm:text-5xl md:text-7xl font-bold text-white mb-1 sm:mb-2 tracking-tighter w-[1.5ch] text-center">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[12px] uppercase tracking-[0.1em] sm:tracking-[0.3em] text-white/40 font-bold">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-xl bg-[#1a0505]/95 border border-[#c5a059]/20 p-10 md:p-14 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8),0_0_50px_rgba(197,160,89,0.05)] relative"
        >
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent" />
          
          <h3 className="text-4xl md:text-5xl font-serif-elegant font-medium text-[#c5a059] mb-12 text-center italic">
            Claim Your Free Seat
          </h3>

          {isSuccess ? (
            <div className="py-20 text-center space-y-6">
              <div className="w-20 h-20 bg-[#c5a059]/20 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-[#c5a059]" />
              </div>
              <h4 className="text-2xl font-heading font-bold text-white">Success!</h4>
              <p className="text-white/60">Your free seat has been reserved. Check your email for details.</p>
              <Button 
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="border-[#c5a059]/40 text-[#c5a059] hover:bg-[#c5a059]/10"
              >
                Register Another
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 text-left">
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/90 uppercase tracking-widest">Name *</label>
                <input
                  type="text"
                  placeholder="Full name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#c5a059]/50 transition-all focus:bg-white/10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-white/90 uppercase tracking-widest">Email *</label>
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#c5a059]/50 transition-all focus:bg-white/10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-white/90 uppercase tracking-widest">Country *</label>
                <div className="relative">
                  <select
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-5 text-white focus:outline-none focus:border-[#c5a059]/50 transition-all appearance-none focus:bg-white/10"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  >
                    <option value="" className="bg-[#1a0505]">Select Country</option>
                    <option value="Malaysia" className="bg-[#1a0505]">Malaysia</option>
                    <option value="Singapore" className="bg-[#1a0505]">Singapore</option>
                    <option value="Afghanistan" className="bg-[#1a0505]">Afghanistan</option>
                    <option value="Albania" className="bg-[#1a0505]">Albania</option>
                    <option value="Algeria" className="bg-[#1a0505]">Algeria</option>
                    <option value="Andorra" className="bg-[#1a0505]">Andorra</option>
                    <option value="Angola" className="bg-[#1a0505]">Angola</option>
                    <option value="Antigua and Barbuda" className="bg-[#1a0505]">Antigua and Barbuda</option>
                    <option value="Argentina" className="bg-[#1a0505]">Argentina</option>
                    <option value="Armenia" className="bg-[#1a0505]">Armenia</option>
                    <option value="Australia" className="bg-[#1a0505]">Australia</option>
                    <option value="Austria" className="bg-[#1a0505]">Austria</option>
                    <option value="Azerbaijan" className="bg-[#1a0505]">Azerbaijan</option>
                    <option value="Bahamas" className="bg-[#1a0505]">Bahamas</option>
                    <option value="Bahrain" className="bg-[#1a0505]">Bahrain</option>
                    <option value="Bangladesh" className="bg-[#1a0505]">Bangladesh</option>
                    <option value="Barbados" className="bg-[#1a0505]">Barbados</option>
                    <option value="Belarus" className="bg-[#1a0505]">Belarus</option>
                    <option value="Belgium" className="bg-[#1a0505]">Belgium</option>
                    <option value="Belize" className="bg-[#1a0505]">Belize</option>
                    <option value="Benin" className="bg-[#1a0505]">Benin</option>
                    <option value="Bhutan" className="bg-[#1a0505]">Bhutan</option>
                    <option value="Bolivia" className="bg-[#1a0505]">Bolivia</option>
                    <option value="Bosnia and Herzegovina" className="bg-[#1a0505]">Bosnia and Herzegovina</option>
                    <option value="Botswana" className="bg-[#1a0505]">Botswana</option>
                    <option value="Brazil" className="bg-[#1a0505]">Brazil</option>
                    <option value="Brunei" className="bg-[#1a0505]">Brunei</option>
                    <option value="Bulgaria" className="bg-[#1a0505]">Bulgaria</option>
                    <option value="Burkina Faso" className="bg-[#1a0505]">Burkina Faso</option>
                    <option value="Burundi" className="bg-[#1a0505]">Burundi</option>
                    <option value="Cabo Verde" className="bg-[#1a0505]">Cabo Verde</option>
                    <option value="Cambodia" className="bg-[#1a0505]">Cambodia</option>
                    <option value="Cameroon" className="bg-[#1a0505]">Cameroon</option>
                    <option value="Canada" className="bg-[#1a0505]">Canada</option>
                    <option value="Central African Republic" className="bg-[#1a0505]">Central African Republic</option>
                    <option value="Chad" className="bg-[#1a0505]">Chad</option>
                    <option value="Chile" className="bg-[#1a0505]">Chile</option>
                    <option value="China" className="bg-[#1a0505]">China</option>
                    <option value="Colombia" className="bg-[#1a0505]">Colombia</option>
                    <option value="Comoros" className="bg-[#1a0505]">Comoros</option>
                    <option value="Congo" className="bg-[#1a0505]">Congo</option>
                    <option value="Costa Rica" className="bg-[#1a0505]">Costa Rica</option>
                    <option value="Croatia" className="bg-[#1a0505]">Croatia</option>
                    <option value="Cuba" className="bg-[#1a0505]">Cuba</option>
                    <option value="Cyprus" className="bg-[#1a0505]">Cyprus</option>
                    <option value="Czech Republic" className="bg-[#1a0505]">Czech Republic</option>
                    <option value="Denmark" className="bg-[#1a0505]">Denmark</option>
                    <option value="Djibouti" className="bg-[#1a0505]">Djibouti</option>
                    <option value="Dominica" className="bg-[#1a0505]">Dominica</option>
                    <option value="Dominican Republic" className="bg-[#1a0505]">Dominican Republic</option>
                    <option value="Ecuador" className="bg-[#1a0505]">Ecuador</option>
                    <option value="Egypt" className="bg-[#1a0505]">Egypt</option>
                    <option value="El Salvador" className="bg-[#1a0505]">El Salvador</option>
                    <option value="Equatorial Guinea" className="bg-[#1a0505]">Equatorial Guinea</option>
                    <option value="Eritrea" className="bg-[#1a0505]">Eritrea</option>
                    <option value="Estonia" className="bg-[#1a0505]">Estonia</option>
                    <option value="Eswatini" className="bg-[#1a0505]">Eswatini</option>
                    <option value="Ethiopia" className="bg-[#1a0505]">Ethiopia</option>
                    <option value="Fiji" className="bg-[#1a0505]">Fiji</option>
                    <option value="Finland" className="bg-[#1a0505]">Finland</option>
                    <option value="France" className="bg-[#1a0505]">France</option>
                    <option value="Gabon" className="bg-[#1a0505]">Gabon</option>
                    <option value="Gambia" className="bg-[#1a0505]">Gambia</option>
                    <option value="Georgia" className="bg-[#1a0505]">Georgia</option>
                    <option value="Germany" className="bg-[#1a0505]">Germany</option>
                    <option value="Ghana" className="bg-[#1a0505]">Ghana</option>
                    <option value="Greece" className="bg-[#1a0505]">Greece</option>
                    <option value="Grenada" className="bg-[#1a0505]">Grenada</option>
                    <option value="Guatemala" className="bg-[#1a0505]">Guatemala</option>
                    <option value="Guinea" className="bg-[#1a0505]">Guinea</option>
                    <option value="Guinea-Bissau" className="bg-[#1a0505]">Guinea-Bissau</option>
                    <option value="Guyana" className="bg-[#1a0505]">Guyana</option>
                    <option value="Haiti" className="bg-[#1a0505]">Haiti</option>
                    <option value="Honduras" className="bg-[#1a0505]">Honduras</option>
                    <option value="Hungary" className="bg-[#1a0505]">Hungary</option>
                    <option value="Iceland" className="bg-[#1a0505]">Iceland</option>
                    <option value="India" className="bg-[#1a0505]">India</option>
                    <option value="Indonesia" className="bg-[#1a0505]">Indonesia</option>
                    <option value="Iran" className="bg-[#1a0505]">Iran</option>
                    <option value="Iraq" className="bg-[#1a0505]">Iraq</option>
                    <option value="Ireland" className="bg-[#1a0505]">Ireland</option>
                    <option value="Israel" className="bg-[#1a0505]">Israel</option>
                    <option value="Italy" className="bg-[#1a0505]">Italy</option>
                    <option value="Jamaica" className="bg-[#1a0505]">Jamaica</option>
                    <option value="Japan" className="bg-[#1a0505]">Japan</option>
                    <option value="Jordan" className="bg-[#1a0505]">Jordan</option>
                    <option value="Kazakhstan" className="bg-[#1a0505]">Kazakhstan</option>
                    <option value="Kenya" className="bg-[#1a0505]">Kenya</option>
                    <option value="Kiribati" className="bg-[#1a0505]">Kiribati</option>
                    <option value="Korea, North" className="bg-[#1a0505]">Korea, North</option>
                    <option value="Korea, South" className="bg-[#1a0505]">Korea, South</option>
                    <option value="Kosovo" className="bg-[#1a0505]">Kosovo</option>
                    <option value="Kuwait" className="bg-[#1a0505]">Kuwait</option>
                    <option value="Kyrgyzstan" className="bg-[#1a0505]">Kyrgyzstan</option>
                    <option value="Laos" className="bg-[#1a0505]">Laos</option>
                    <option value="Latvia" className="bg-[#1a0505]">Latvia</option>
                    <option value="Lebanon" className="bg-[#1a0505]">Lebanon</option>
                    <option value="Lesotho" className="bg-[#1a0505]">Lesotho</option>
                    <option value="Liberia" className="bg-[#1a0505]">Liberia</option>
                    <option value="Libya" className="bg-[#1a0505]">Libya</option>
                    <option value="Liechtenstein" className="bg-[#1a0505]">Liechtenstein</option>
                    <option value="Lithuania" className="bg-[#1a0505]">Lithuania</option>
                    <option value="Luxembourg" className="bg-[#1a0505]">Luxembourg</option>
                    <option value="Madagascar" className="bg-[#1a0505]">Madagascar</option>
                    <option value="Malawi" className="bg-[#1a0505]">Malawi</option>
                    <option value="Maldives" className="bg-[#1a0505]">Maldives</option>
                    <option value="Mali" className="bg-[#1a0505]">Mali</option>
                    <option value="Malta" className="bg-[#1a0505]">Malta</option>
                    <option value="Marshall Islands" className="bg-[#1a0505]">Marshall Islands</option>
                    <option value="Mauritania" className="bg-[#1a0505]">Mauritania</option>
                    <option value="Mauritius" className="bg-[#1a0505]">Mauritius</option>
                    <option value="Mexico" className="bg-[#1a0505]">Mexico</option>
                    <option value="Micronesia" className="bg-[#1a0505]">Micronesia</option>
                    <option value="Moldova" className="bg-[#1a0505]">Moldova</option>
                    <option value="Monaco" className="bg-[#1a0505]">Monaco</option>
                    <option value="Mongolia" className="bg-[#1a0505]">Mongolia</option>
                    <option value="Montenegro" className="bg-[#1a0505]">Montenegro</option>
                    <option value="Morocco" className="bg-[#1a0505]">Morocco</option>
                    <option value="Mozambique" className="bg-[#1a0505]">Mozambique</option>
                    <option value="Myanmar" className="bg-[#1a0505]">Myanmar</option>
                    <option value="Namibia" className="bg-[#1a0505]">Namibia</option>
                    <option value="Nauru" className="bg-[#1a0505]">Nauru</option>
                    <option value="Nepal" className="bg-[#1a0505]">Nepal</option>
                    <option value="Netherlands" className="bg-[#1a0505]">Netherlands</option>
                    <option value="New Zealand" className="bg-[#1a0505]">New Zealand</option>
                    <option value="Nicaragua" className="bg-[#1a0505]">Nicaragua</option>
                    <option value="Niger" className="bg-[#1a0505]">Niger</option>
                    <option value="Nigeria" className="bg-[#1a0505]">Nigeria</option>
                    <option value="North Macedonia" className="bg-[#1a0505]">North Macedonia</option>
                    <option value="Norway" className="bg-[#1a0505]">Norway</option>
                    <option value="Oman" className="bg-[#1a0505]">Oman</option>
                    <option value="Pakistan" className="bg-[#1a0505]">Pakistan</option>
                    <option value="Palau" className="bg-[#1a0505]">Palau</option>
                    <option value="Palestine" className="bg-[#1a0505]">Palestine</option>
                    <option value="Panama" className="bg-[#1a0505]">Panama</option>
                    <option value="Papua New Guinea" className="bg-[#1a0505]">Papua New Guinea</option>
                    <option value="Paraguay" className="bg-[#1a0505]">Paraguay</option>
                    <option value="Peru" className="bg-[#1a0505]">Peru</option>
                    <option value="Philippines" className="bg-[#1a0505]">Philippines</option>
                    <option value="Poland" className="bg-[#1a0505]">Poland</option>
                    <option value="Portugal" className="bg-[#1a0505]">Portugal</option>
                    <option value="Qatar" className="bg-[#1a0505]">Qatar</option>
                    <option value="Romania" className="bg-[#1a0505]">Romania</option>
                    <option value="Russia" className="bg-[#1a0505]">Russia</option>
                    <option value="Rwanda" className="bg-[#1a0505]">Rwanda</option>
                    <option value="Saint Kitts and Nevis" className="bg-[#1a0505]">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia" className="bg-[#1a0505]">Saint Lucia</option>
                    <option value="Saint Vincent and the Grenadines" className="bg-[#1a0505]">Saint Vincent and the Grenadines</option>
                    <option value="Samoa" className="bg-[#1a0505]">Samoa</option>
                    <option value="San Marino" className="bg-[#1a0505]">San Marino</option>
                    <option value="Sao Tome and Principe" className="bg-[#1a0505]">Sao Tome and Principe</option>
                    <option value="Saudi Arabia" className="bg-[#1a0505]">Saudi Arabia</option>
                    <option value="Senegal" className="bg-[#1a0505]">Senegal</option>
                    <option value="Serbia" className="bg-[#1a0505]">Serbia</option>
                    <option value="Seychelles" className="bg-[#1a0505]">Seychelles</option>
                    <option value="Sierra Leone" className="bg-[#1a0505]">Sierra Leone</option>
                    <option value="Slovakia" className="bg-[#1a0505]">Slovakia</option>
                    <option value="Slovenia" className="bg-[#1a0505]">Slovenia</option>
                    <option value="Solomon Islands" className="bg-[#1a0505]">Solomon Islands</option>
                    <option value="Somalia" className="bg-[#1a0505]">Somalia</option>
                    <option value="South Africa" className="bg-[#1a0505]">South Africa</option>
                    <option value="South Sudan" className="bg-[#1a0505]">South Sudan</option>
                    <option value="Spain" className="bg-[#1a0505]">Spain</option>
                    <option value="Sri Lanka" className="bg-[#1a0505]">Sri Lanka</option>
                    <option value="Sudan" className="bg-[#1a0505]">Sudan</option>
                    <option value="Suriname" className="bg-[#1a0505]">Suriname</option>
                    <option value="Sweden" className="bg-[#1a0505]">Sweden</option>
                    <option value="Switzerland" className="bg-[#1a0505]">Switzerland</option>
                    <option value="Syria" className="bg-[#1a0505]">Syria</option>
                    <option value="Taiwan" className="bg-[#1a0505]">Taiwan</option>
                    <option value="Tajikistan" className="bg-[#1a0505]">Tajikistan</option>
                    <option value="Tanzania" className="bg-[#1a0505]">Tanzania</option>
                    <option value="Thailand" className="bg-[#1a0505]">Thailand</option>
                    <option value="Timor-Leste" className="bg-[#1a0505]">Timor-Leste</option>
                    <option value="Togo" className="bg-[#1a0505]">Togo</option>
                    <option value="Tonga" className="bg-[#1a0505]">Tonga</option>
                    <option value="Trinidad and Tobago" className="bg-[#1a0505]">Trinidad and Tobago</option>
                    <option value="Tunisia" className="bg-[#1a0505]">Tunisia</option>
                    <option value="Turkey" className="bg-[#1a0505]">Turkey</option>
                    <option value="Turkmenistan" className="bg-[#1a0505]">Turkmenistan</option>
                    <option value="Tuvalu" className="bg-[#1a0505]">Tuvalu</option>
                    <option value="Uganda" className="bg-[#1a0505]">Uganda</option>
                    <option value="Ukraine" className="bg-[#1a0505]">Ukraine</option>
                    <option value="United Arab Emirates" className="bg-[#1a0505]">United Arab Emirates</option>
                    <option value="United Kingdom" className="bg-[#1a0505]">United Kingdom</option>
                    <option value="United States" className="bg-[#1a0505]">United States</option>
                    <option value="Uruguay" className="bg-[#1a0505]">Uruguay</option>
                    <option value="Uzbekistan" className="bg-[#1a0505]">Uzbekistan</option>
                    <option value="Vanuatu" className="bg-[#1a0505]">Vanuatu</option>
                    <option value="Vatican City" className="bg-[#1a0505]">Vatican City</option>
                    <option value="Venezuela" className="bg-[#1a0505]">Venezuela</option>
                    <option value="Vietnam" className="bg-[#1a0505]">Vietnam</option>
                    <option value="Yemen" className="bg-[#1a0505]">Yemen</option>
                    <option value="Zambia" className="bg-[#1a0505]">Zambia</option>
                    <option value="Zimbabwe" className="bg-[#1a0505]">Zimbabwe</option>
                    <option value="Other" className="bg-[#1a0505]">Other</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-white/90 uppercase tracking-widest">For A WhatsApp/SMS Reminder (Optional)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Mobile number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#c5a059]/50 transition-all focus:bg-white/10"
                  value={formData.mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, mobile: value });
                  }}
                />
                <div className="space-y-2 mt-4">
                  <p className="text-[11px] text-white/40 leading-relaxed italic">
                    We’ll only use this to send you a reminder for the training. And if there is any cool bonuses along the way, you’ll be the first to know. 😉
                  </p>
                  <p className="text-[11px] text-white/40 leading-relaxed font-bold">
                    Your info is safe. You can unsubscribe anytime.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c5a059] hover:bg-[#b38f4d] text-black font-black py-5 md:py-10 text-base sm:text-xl md:text-2xl rounded-2xl shadow-[0_15px_50px_rgba(197,160,89,0.3)] transition-all duration-300 uppercase tracking-tighter disabled:opacity-50 whitespace-normal h-auto leading-tight"
                >
                  {isSubmitting ? 'Reserving...' : 'Yes, Reserve My Free Seat'}
                </Button>
              </div>

              <div className="space-y-6 pt-6">
                <label className="flex gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer appearance-none w-5 h-5 rounded border border-white/20 bg-white/5 checked:bg-[#c5a059] checked:border-[#c5a059] transition-all"
                      checked={formData.agreed}
                      onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    />
                    <Check className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-[11px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                    I agree to terms & conditions provided by the company. By providing my phone number, I agree to receive text messages from the business. We value your privacy. Your email will be used solely to provide you with exclusive training materials and updates on the training.
                  </span>
                </label>
                <div className="flex items-center justify-center gap-2 text-[11px] text-white/30">
                  <Info className="h-3 w-3" />
                  <span>Your details are kept private. Unsubscribe anytime.</span>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
});
