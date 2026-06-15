import { useMemo, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { MessageCircle, Pencil, Send, Trash2 } from 'lucide-react'
import {
  createConversationAction,
  createMessageAction,
  deleteConversationAction,
  deleteMessageAction,
  getCareFlowData,
  updateConversationAction,
  updateMessageAction,
} from '../lib/careflow-actions'
import type {
  Conversation,
  ConversationInput,
  Message,
  MessageInput,
  SenderRole,
} from '../lib/careflow-types'
import { cn } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'

export const Route = createFileRoute('/chats')({
  loader: () => getCareFlowData(),
  component: ChatsRoute,
})

const emptyConversation: ConversationInput = {
  title: '',
  doctorName: '',
  specialty: '',
  status: 'Open',
}

function ChatsRoute() {
  const router = useRouter()
  const data = Route.useLoaderData()
  const [selectedId, setSelectedId] = useState(
    data.conversations[0]?.id ?? '',
  )
  const selectedConversation = useMemo(
    () =>
      data.conversations.find((conversation) => conversation.id === selectedId) ??
      data.conversations[0],
    [data.conversations, selectedId],
  )
  const [conversationDraft, setConversationDraft] =
    useState<ConversationInput>(emptyConversation)
  const [editingConversationId, setEditingConversationId] = useState<
    string | null
  >(null)
  const [messageDraft, setMessageDraft] = useState<MessageInput>({
    conversationId: selectedConversation?.id ?? '',
    sender: 'Patient',
    body: '',
    read: true,
  })
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)

  async function refresh() {
    await router.invalidate()
  }

  async function saveConversation() {
    if (editingConversationId) {
      await updateConversationAction({
        data: { ...conversationDraft, id: editingConversationId },
      })
    } else {
      const result = await createConversationAction({ data: conversationDraft })
      setSelectedId(result.conversations[0]?.id ?? selectedId)
    }
    setConversationDraft(emptyConversation)
    setEditingConversationId(null)
    await refresh()
  }

  async function saveMessage() {
    const conversationId = selectedConversation.id
    if (editingMessageId) {
      await updateMessageAction({
        data: {
          ...messageDraft,
          conversationId,
          messageId: editingMessageId,
        },
      })
    } else {
      await createMessageAction({
        data: { ...messageDraft, conversationId },
      })
    }
    setMessageDraft({
      conversationId,
      sender: 'Patient',
      body: '',
      read: true,
    })
    setEditingMessageId(null)
    await refresh()
  }

  function editConversation(conversation: Conversation) {
    setEditingConversationId(conversation.id)
    setConversationDraft({
      title: conversation.title,
      doctorName: conversation.doctorName,
      specialty: conversation.specialty,
      status: conversation.status,
    })
  }

  function editMessage(message: Message) {
    setEditingMessageId(message.id)
    setMessageDraft({
      conversationId: selectedConversation.id,
      sender: message.sender,
      body: message.body,
      read: message.read,
    })
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr_380px]">
      <Card className="h-fit p-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="size-5" aria-hidden />
            Care Threads
          </CardTitle>
          <p className="text-sm text-care-muted">
            Create, update, close, and remove care conversations.
          </p>
        </CardHeader>
        <CardContent className="mt-4 grid gap-2.5">
          {data.conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={cn(
                'group rounded-3xl border border-transparent bg-care-green-soft p-4 text-left outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-care-ink/10 hover:bg-white hover:shadow-[0_14px_35px_rgb(31_47_37/0.1)] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-care-ink/20',
                selectedConversation?.id === conversation.id &&
                  'border-care-ink bg-care-ink text-white shadow-[0_14px_35px_rgb(31_47_37/0.16)] hover:border-care-ink hover:bg-care-ink',
              )}
              onClick={() => setSelectedId(conversation.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold">{conversation.title}</h2>
                <Badge variant={conversation.status === 'Open' ? 'paid' : 'muted'}>
                  {conversation.status}
                </Badge>
              </div>
              <p
                className={cn(
                  'mt-1 text-sm text-care-muted transition-colors group-hover:text-care-ink/70',
                  selectedConversation?.id === conversation.id && 'text-white/62',
                )}
              >
                {conversation.doctorName} · {conversation.specialty}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="p-5">
        {selectedConversation ? (
          <>
            <CardHeader className="mb-4 flex-row items-start justify-between">
              <div>
                <CardTitle>{selectedConversation.title}</CardTitle>
                <p className="mt-1 text-sm text-care-muted">
                  {selectedConversation.doctorName} ·{' '}
                  {selectedConversation.specialty}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => editConversation(selectedConversation)}
                >
                  <Pencil className="mr-2 size-3.5" aria-hidden />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={async () => {
                    await deleteConversationAction({
                      data: { id: selectedConversation.id },
                    })
                    setSelectedId('')
                    await refresh()
                  }}
                >
                  <Trash2 className="mr-2 size-3.5" aria-hidden />
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3">
              {selectedConversation.messages.map((message) => (
                <article
                  key={message.id}
                  className={cn(
                    'max-w-[84%] rounded-3xl p-4',
                    message.sender === 'Patient'
                      ? 'ml-auto bg-care-ink text-white'
                      : 'bg-care-green-soft',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] opacity-70">
                      {message.sender}
                    </p>
                    <Badge variant={message.read ? 'paid' : 'unpaid'}>
                      {message.read ? 'Read' : 'Unread'}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6">{message.body}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => editMessage(message)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        await deleteMessageAction({
                          data: {
                            conversationId: selectedConversation.id,
                            messageId: message.id,
                          },
                        })
                        await refresh()
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </article>
              ))}
            </CardContent>
          </>
        ) : (
          <p className="rounded-3xl bg-care-green-soft p-5 text-sm text-care-muted">
            Create a conversation to start secure care messaging.
          </p>
        )}
      </Card>

      <aside className="grid content-start gap-5">
        <Card className="p-5">
          <CardHeader>
            <CardTitle>
              {editingConversationId ? 'Edit Thread' : 'Create Thread'}
            </CardTitle>
          </CardHeader>
          <form
            className="mt-4 grid gap-3"
            onSubmit={async (event) => {
              event.preventDefault()
              await saveConversation()
            }}
          >
            <Field
              label="Title"
              value={conversationDraft.title}
              onChange={(title) =>
                setConversationDraft((current) => ({ ...current, title }))
              }
            />
            <Field
              label="Doctor or team"
              value={conversationDraft.doctorName}
              onChange={(doctorName) =>
                setConversationDraft((current) => ({ ...current, doctorName }))
              }
            />
            <Field
              label="Specialty"
              value={conversationDraft.specialty}
              onChange={(specialty) =>
                setConversationDraft((current) => ({ ...current, specialty }))
              }
            />
            <SelectField
              label="Status"
              value={conversationDraft.status}
              options={['Open', 'Closed']}
              onChange={(status) =>
                setConversationDraft((current) => ({ ...current, status }))
              }
            />
            <Button type="submit" className="rounded-2xl">
              {editingConversationId ? 'Save thread' : 'Create thread'}
            </Button>
          </form>
        </Card>

        {selectedConversation && (
          <Card className="p-5">
            <CardHeader>
              <CardTitle>
                {editingMessageId ? 'Edit Message' : 'Send Message'}
              </CardTitle>
            </CardHeader>
            <form
              className="mt-4 grid gap-3"
              onSubmit={async (event) => {
                event.preventDefault()
                await saveMessage()
              }}
            >
              <SelectField
                label="Sender"
                value={messageDraft.sender}
                options={['Patient', 'Doctor', 'Care Team'] as SenderRole[]}
                onChange={(sender) =>
                  setMessageDraft((current) => ({ ...current, sender }))
                }
              />
              <label className="grid gap-1.5 text-sm font-semibold">
                Message
                <textarea
                  required
                  value={messageDraft.body}
                  onChange={(event) =>
                    setMessageDraft((current) => ({
                      ...current,
                      body: event.target.value,
                    }))
                  }
                  className="min-h-32 rounded-2xl border border-care-line bg-white px-3 py-3 text-sm outline-none transition focus:border-care-ink/30 focus:ring-2 focus:ring-care-ink/10"
                />
              </label>
              <Button type="submit" className="rounded-2xl">
                <Send className="mr-2 size-4" aria-hidden />
                {editingMessageId ? 'Save message' : 'Send message'}
              </Button>
            </form>
          </Card>
        )}
      </aside>
    </div>
  )
}

function Field({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: string) => void
  value: string
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold">
      {label}
      <input
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-2xl border border-care-line bg-white px-3 text-sm outline-none transition focus:border-care-ink/30 focus:ring-2 focus:ring-care-ink/10"
      />
    </label>
  )
}

function SelectField<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string
  onChange: (value: T) => void
  options: T[]
  value: T
}) {
  return (
    <div className="grid min-w-0 gap-1.5 text-sm font-semibold">
      {label}
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as T)}
      >
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
