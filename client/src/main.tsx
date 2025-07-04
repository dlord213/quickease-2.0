// landing page
import LandingPage from "./routes/LandingPage";

// auths pages
import AuthLayout from "./routes/(auth)/AuthLayout";
import AuthLoginPage from "./routes/(auth)/AuthLogin";
import AuthRegisterPage from "./routes/(auth)/AuthRegister";

// learner pages
import LearnerForumPage from "./routes/(learner)/(dashboard)/LearnerForum";
import LearnerLayout from "./routes/(learner)/LearnerLayout";
import LearnerLibraryPage from "./routes/(learner)/(dashboard)/LearnerLibrary";
import LearnerNotePage from "./routes/(learner)/(note)/LearnerNote";
import LearnerSummarizePage from "./routes/(learner)/(dashboard)/LearnerSummarize";
import LearnerProfilePage from "./routes/(learner)/(profile)/LearnerProfile";
import LearnerSettingsPage from "./routes/(learner)/(settings)/LearnerSettings";
import LearnerTimerPage from "./routes/(learner)/(dashboard)/LearnerTimer";
import LearnerPostPage from "./routes/(learner)/(post)/LearnerPost";
import LearnerQuizzes from "./routes/(learner)/(dashboard)/LearnerQuizzes";
import LearnerCreateFlashcardPage from "./routes/(learner)/(flashcard)/LearnerCreateFlashcard";
import LearnerFlashcardPage from "./routes/(learner)/(flashcard)/LearnerFlashcard";
import LearnerFlashcardsPage from "./routes/(learner)/(dashboard)/LearnerFlashcards";
import LearnerQuizPage from "./routes/(learner)/(quiz)/LearnerQuiz";
import LearnerCreateQuizPage from "./routes/(learner)/(quiz)/LearnerCreateQuiz";
import LearnerCreateNotePage from "./routes/(learner)/(note)/LearnerCreateNote";
import LearnerAnswerQuizPage from "./routes/(learner)/(quiz)/LearnerAnswerQuiz";
import LearnerEditQuizPage from "./routes/(learner)/(quiz)/LearnerEditQuiz";
import LearnerQuizAttemptPage from "./routes/(learner)/(quiz)/LearnerViewAttempt";
import LearnerAICreateNotePage from "./routes/(learner)/(note)/LearnerAICreateNote";
import LearnerAIFlashcardPage from "./routes/(learner)/(flashcard)/LearnerAIFlashcard";
import LearnerEditFlashcardPage from "./routes/(learner)/(flashcard)/LearnerEditFlashcard";
import LearnerEditAIFlashcardPage from "./routes/(learner)/(flashcard)/LearnerAIEditFlashcard";
import LearnerAIEditQuizPage from "./routes/(learner)/(quiz)/LearnerAIEditQuiz";
import LearnerEditPostPage from "./routes/(learner)/(post)/LearnerEditPost";

// admin pages
import AdminLayout from "./routes/(admin)/AdminLayout";
import AdminManageUserPage from "./routes/(admin)/(user)/AdminManageUser";
import AdminManageUsersPage from "./routes/(admin)/(dashboard)/AdminManageUsers";
import AdminManageReportsPage from "./routes/(admin)/(dashboard)/AdminManageReports";
import AdminManagePostPage from "./routes/(admin)/(report)/AdminManageReport";

import _API_INSTANCE from "./utils/axios";

import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  checkAuthAndRedirect,
  loadLearnerResources,
  getGeneratedContent,
} from "./utils/router";

import "../global.css";
import useAuth from "./hooks/useAuth";

const client = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
    loader: checkAuthAndRedirect,
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: AuthLoginPage, loader: checkAuthAndRedirect },
      {
        path: "register",
        Component: AuthRegisterPage,
        loader: checkAuthAndRedirect,
      },
    ],
  },
  {
    path: "learner",
    Component: LearnerLayout,
    loader: loadLearnerResources,
    children: [
      {
        index: true,
        Component: LearnerForumPage,
      },
      {
        path: "library",
        Component: LearnerLibraryPage,
        loader: loadLearnerResources,
      },
      { path: "summarize", Component: LearnerSummarizePage },
      { path: "profile", Component: LearnerProfilePage },
      {
        path: "profile/:id",
        Component: LearnerProfilePage,
        loader: async ({ params }) => {
          try {
            const { data } = await _API_INSTANCE.get(
              `/users/view/${params.id}`
            );

            return data;
          } catch (err) {
            console.log(err);
            toast.error("Error viewing profile.");
            return redirect("/");
          }
        },
      },

      {
        path: "post",
        children: [
          {
            path: ":id",
            Component: LearnerPostPage,
            index: true,
            loader: async ({ params }) => {
              try {
                const { data } = await _API_INSTANCE.get(
                  `/forum/post/${params.id}`
                );
                return { id: data.id };
              } catch {
                return redirect("/learner");
              }
            },
          },
          {
            path: ":id/edit",
            Component: LearnerEditPostPage,
            index: true,
            loader: async ({ params }) => {
              try {
                const { status, data } = await _API_INSTANCE.get(
                  `/forum/post/${params.id}`
                );

                if (status == 200) {
                  if (data.user_id == useAuth.getState().user?.id) {
                    return { id: data.id };
                  } else {
                    toast.error("You can't edit a post that's not yours! :)");
                    return redirect(`/learner/post/${params.id}`);
                  }
                }
              } catch {
                return redirect("/learner");
              }
            },
          },
        ],
      },
      {
        path: "flashcards",
        children: [
          { index: true, Component: LearnerFlashcardsPage },
          {
            path: ":id",
            Component: LearnerFlashcardPage,
            loader: async ({ params }) => {
              try {
                const { data } = await _API_INSTANCE.get(
                  `/flashcard/${params.id}`
                );
                return data;
              } catch {
                return redirect("/learner/library?tab=flashcard");
              }
            },
          },
          {
            path: ":id/edit",
            Component: LearnerEditFlashcardPage,
            loader: async ({ params }) => {
              try {
                const { data } = await _API_INSTANCE.get(
                  `/flashcard/${params.id}`
                );
                return data;
              } catch {
                return redirect("/learner/library?tab=flashcard");
              }
            },
          },
          {
            path: "ai",
            Component: LearnerAIFlashcardPage,
            loader: () => getGeneratedContent() ?? redirect(-1),
          },
          {
            path: "ai/edit",
            Component: LearnerEditAIFlashcardPage,
            loader: () => getGeneratedContent() ?? redirect(-1),
          },
          { path: "create", Component: LearnerCreateFlashcardPage },
        ],
      },
      {
        path: "quizzes",
        children: [
          { index: true, Component: LearnerQuizzes },
          {
            path: ":id",
            Component: LearnerQuizPage,
            loader: async ({ params }) => {
              try {
                const { data } = await _API_INSTANCE.get(`/quiz/${params.id}`);
                return data;
              } catch {
                toast.error("Error getting quiz data.");
                return redirect("/learner/library?tab=quizzes");
              }
            },
          },
          {
            path: ":id/answer",
            Component: LearnerAnswerQuizPage,
            loader: ({ params }) => {
              try {
                const raw = localStorage.getItem("QUICKEASE_CURRENT_QUIZ");
                const parsed = JSON.parse(raw!);
                return parsed?.id == params.id
                  ? parsed
                  : redirect("/learner/library?tab=quizzes");
              } catch {
                return redirect("/learner/library?tab=quizzes");
              }
            },
          },
          {
            path: ":id/edit",
            Component: LearnerEditQuizPage,
            loader: ({ params }) => {
              try {
                const raw = localStorage.getItem("QUICKEASE_CURRENT_QUIZ");
                const parsed = JSON.parse(raw!);
                return parsed?.id == params.id
                  ? parsed
                  : redirect("/learner/library?tab=quizzes");
              } catch {
                return redirect("/learner/library?tab=quizzes");
              }
            },
          },
          {
            path: ":id/attempt/:attempt_id",
            Component: LearnerQuizAttemptPage,
            loader: async ({ params }) => {
              try {
                const { data } = await _API_INSTANCE.get(
                  `/quiz/attempt/${params.attempt_id}`
                );
                return data;
              } catch {
                return redirect("/learner/library?tab=quizzes");
              }
            },
          },
          { path: "create", Component: LearnerCreateQuizPage },
          {
            path: "ai",
            Component: LearnerAIEditQuizPage,
            loader: () => {
              const raw = localStorage.getItem("QUICKEASE_GENERATED_CONTENT");
              if (!raw) return redirect(-1);
              const parsed = JSON.parse(raw);
              return {
                title: parsed.content.title,
                quiz_content: JSON.parse(parsed.content.content),
              };
            },
          },
        ],
      },
      { path: "settings", Component: LearnerSettingsPage },
      { path: "timer", Component: LearnerTimerPage },
      {
        path: "note/:id",
        Component: LearnerNotePage,
        loader: async ({ params }) => {
          try {
            const { data } = await _API_INSTANCE.get(`/notes/${params.id}`);
            return data;
          } catch {
            return redirect("/learner/library?tab=notes");
          }
        },
      },
      { path: "note/create", Component: LearnerCreateNotePage },
      {
        path: "note/create/ai",
        Component: LearnerAICreateNotePage,
        loader: () => {
          const raw = localStorage.getItem("QUICKEASE_GENERATED_CONTENT");
          return raw ? JSON.parse(raw) : "";
        },
      },
    ],
  },
  {
    path: "admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminManageUsersPage },
      { path: "reports", Component: AdminManageReportsPage },
      { path: "user/:userId", Component: AdminManageUserPage },
      { path: "report/:reportId", Component: AdminManagePostPage },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
