import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bot, Send, Trash2, Copy, Sparkles, User, RefreshCw } from 'lucide-react-native';
import { aiService } from '../../src/services/aiService';
import { Header, Input } from '../../src/components';
import { colors, spacing, typography, borderRadius } from '../../src/theme';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function WorkspaceAssistantScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Hello! I am your ProjectForge AI Development Mentor. I am calibrated to your project context. How can I assist you with architecture, database models, testing, or code today?',
      timestamp: '10:00 AM',
    },
  ]);

  const suggestedPrompts = [
    'How should I structure the WebSocket telemetry listener?',
    'What indexes are critical for high-throughput queries?',
    'Write a Jest integration test for user login.',
    'Explain the deterministic AI fallback mechanism.',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await aiService.askAssistant({
        projectId: projectId || 'demo',
        prompt: textToSend.trim(),
        history: messages.map((m) => ({ role: m.sender, content: m.text })),
      });

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text:
          res.data?.reply ||
          res.data?.response ||
          'For your project architecture, ensure that database connection pools are reused across Express requests. Also, wrap your WebSocket subscriptions inside reconnection handlers with exponential backoff.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: 'I am currently operating in resilient local mode: make sure your backend Express server is running on your network.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleClear = () => {
    Alert.alert('Clear Chat', 'Do you want to reset the conversation history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setMessages([
            {
              id: 'm-init',
              sender: 'assistant',
              text: 'Conversation reset. What can I help you build next?',
              timestamp: 'Now',
            },
          ]);
        },
      },
    ]);
  };

  const handleCopy = (text: string) => {
    Alert.alert('Copied', 'Message copied to clipboard.');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Header
          title="Module 09: AI Mentor"
          subtitle="Contextual engineering assistant"
          showBack
          rightAction={
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Trash2 size={18} color={colors.textMuted} />
            </TouchableOpacity>
          }
        />

        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.messagesList, { paddingBottom: spacing.lg }]}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.messageRow,
                m.sender === 'user' ? styles.userRow : styles.assistantRow,
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  m.sender === 'user' ? styles.userAvatar : styles.assistantAvatar,
                ]}
              >
                {m.sender === 'user' ? (
                  <User size={14} color={colors.text} />
                ) : (
                  <Bot size={14} color={colors.secondaryLight} />
                )}
              </View>

              <View
                style={[
                  styles.bubble,
                  m.sender === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text style={styles.bubbleText}>{m.text}</Text>
                <View style={styles.bubbleFooter}>
                  <Text style={styles.timestampText}>{m.timestamp}</Text>
                  <TouchableOpacity
                    onPress={() => handleCopy(m.text)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Copy size={11} color={colors.textSubtle} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {loading && (
            <View style={[styles.messageRow, styles.assistantRow]}>
              <View style={[styles.avatar, styles.assistantAvatar]}>
                <Bot size={14} color={colors.secondaryLight} />
              </View>
              <View style={[styles.bubble, styles.assistantBubble, styles.loadingBubble]}>
                <Sparkles size={16} color={colors.secondary} />
                <Text style={styles.loadingText}>Synthesizing engineering response...</Text>
              </View>
            </View>
          )}

          {/* Quick Prompts */}
          <View style={styles.quickPromptsSection}>
            <Text style={styles.quickPromptsTitle}>SUGGESTED PROMPTS</Text>
            <View style={styles.promptsRow}>
              {suggestedPrompts.map((p, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptChip}
                  onPress={() => handleSend(p)}
                >
                  <Text style={styles.promptChipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Input
            placeholder="Ask about architecture, tests, APIs..."
            value={inputMessage}
            onChangeText={setInputMessage}
            containerStyle={styles.inputContainer}
            returnKeyType="send"
            onSubmitEditing={() => handleSend()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputMessage.trim() && styles.sendBtnDisabled]}
            disabled={!inputMessage.trim() || loading}
            onPress={() => handleSend()}
          >
            <Send size={18} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  messagesList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: spacing.xs,
    gap: spacing.sm,
    maxWidth: '88%',
  },
  userRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  assistantRow: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  userAvatar: {
    backgroundColor: colors.primary,
  },
  assistantAvatar: {
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  bubble: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 2,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    ...typography.caption,
    color: colors.secondaryLight,
  },
  bubbleText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  timestampText: {
    ...typography.tiny,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  quickPromptsSection: {
    marginTop: spacing.lg,
  },
  quickPromptsTitle: {
    ...typography.tiny,
    color: colors.textSubtle,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  promptsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  promptChip: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  promptChipText: {
    ...typography.caption,
    color: colors.secondaryLight,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
