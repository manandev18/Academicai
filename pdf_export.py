from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os

def export_feedback_to_pdf(user_email, prompt, breakdown, feedback):
    # Create filename
    filename = f"{user_email.replace('@','_')}_session.pdf"
    
    # Create PDF document
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30
    )
    story.append(Paragraph("Academic Integrity Report", title_style))
    story.append(Spacer(1, 12))
    
    # User info
    story.append(Paragraph(f"<b>User:</b> {user_email}", styles['Normal']))
    story.append(Spacer(1, 12))
    
    # Prompt
    if prompt:
        story.append(Paragraph("<b>Assignment Prompt:</b>", styles['Heading2']))
        story.append(Paragraph(prompt, styles['Normal']))
        story.append(Spacer(1, 12))
    
    # Breakdown
    if breakdown:
        story.append(Paragraph("<b>Assignment Breakdown:</b>", styles['Heading2']))
        story.append(Paragraph(breakdown, styles['Normal']))
        story.append(Spacer(1, 12))
    
    # Feedback
    if feedback:
        story.append(Paragraph("<b>Feedback:</b>", styles['Heading2']))
        story.append(Paragraph(feedback, styles['Normal']))
        story.append(Spacer(1, 12))
    
    # Build PDF
    doc.build(story)
    return filename