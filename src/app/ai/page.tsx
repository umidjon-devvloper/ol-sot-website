'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Send, ChevronRight, Loader2 } from 'lucide-react';

import { useT } from '../../hooks/useT';
import { useAuthStore } from '../../store/authStore';
import { aiApi } from '../../services/marketplaceApi';
import { AIMessage, Product } from '../../types';
import { formatPrice, getML } from '../../utils/format';
import { cn } from '../../lib/cn';

export default function AIPage() {
  const { t, lang } = useT();
  const user = useAuthStore((s) => s.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = t('ai.suggestions') as string[];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    if (!user) {
      window.location.href = '/login';
      return;
    }

    const userMsg: AIMessage = { role: 'user', content: message, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const response = await aiApi.ask(message, history);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.message,
          recommendedProducts: response.recommendedProducts,
          timestamp: Date.now(),
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: error.message || t('common.error'), timestamp: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="container-page py-8 lg:py-12 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-purple flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
            {t('ai.title')}
          </h1>
        </div>
      </div>

      {/* Messages or Welcome */}
      <div className="card overflow-hidden">
        <div className="min-h-[500px] max-h-[60vh] overflow-y-auto p-6 lg:p-8">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-purple flex items-center justify-center shadow-xl shadow-purple-500/30 mb-5">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">
                {t('ai.welcome')}
              </h2>
              <p className="text-sm text-ink-secondary dark:text-ink-dark-secondary max-w-md">
                {t('ai.welcomeDesc')}
              </p>

              {/* Suggestions */}
              <div className="mt-8 w-full max-w-lg space-y-2">
                {Array.isArray(suggestions) &&
                  suggestions.map((sugg: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(sugg)}
                      className="w-full text-left flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/5 transition-colors text-sm font-medium"
                    >
                      <span>{sugg}</span>
                      <ChevronRight className="w-4 h-4 text-ink-muted" />
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} lang={lang} />
              ))}

              {loading && (
                <div className="flex items-start gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-zinc-100 dark:bg-[#1F1F28] inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                    <span className="text-sm">{t('ai.typing')}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ai.placeholder')}
              className="input flex-1 h-12"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all flex-shrink-0',
                input.trim() && !loading
                  ? 'bg-brand-500 text-white hover:bg-brand-600 hover:scale-105'
                  : 'bg-zinc-100 dark:bg-[#1F1F28] text-ink-muted cursor-not-allowed'
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {!user && (
            <p className="mt-3 text-xs text-center text-ink-muted">
              <Link href="/login" className="text-brand-500 hover:text-brand-600 font-semibold">
                Kirish
              </Link>
              {' '}AI yordamchidan foydalanish uchun
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, lang }: { message: AIMessage; lang: 'uz' | 'ru' | 'en' }) {
  const isUser = message.role === 'user';
  const { t } = useT();

  return (
    <div className={cn('flex items-start gap-3 animate-fade-in', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold',
          isUser ? 'bg-zinc-900 dark:bg-zinc-700' : 'bg-gradient-purple'
        )}
      >
        {isUser ? 'You' : <Sparkles className="w-4 h-4" />}
      </div>

      <div className={cn('flex-1 min-w-0', isUser && 'flex flex-col items-end')}>
        <div
          className={cn(
            'inline-block max-w-[85%] px-4 py-3 rounded-2xl',
            isUser
              ? 'bg-brand-500 text-white rounded-tr-sm'
              : 'bg-zinc-100 dark:bg-[#1F1F28] rounded-tl-sm'
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Recommended products */}
        {!isUser && message.recommendedProducts && message.recommendedProducts.length > 0 && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
            {message.recommendedProducts.slice(0, 4).map((p: Product) => (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className="card p-3 hover:shadow-md hover:border-brand-500/50 transition-all flex gap-3"
              >
                {p.thumbnail && (
                  <div className="w-14 h-14 rounded-lg bg-zinc-100 dark:bg-[#1F1F28] overflow-hidden flex-shrink-0">
                    <img src={p.thumbnail} alt="" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {p.brand && (
                    <p className="text-[10px] font-bold tracking-wider text-ink-muted uppercase">
                      {p.brand}
                    </p>
                  )}
                  <p className="text-xs font-semibold line-clamp-1">{getML(p.title, lang)}</p>
                  <p className="text-sm font-bold text-brand-500 mt-1">
                    {formatPrice(p.discountPrice || p.price)} {t('common.sum')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
